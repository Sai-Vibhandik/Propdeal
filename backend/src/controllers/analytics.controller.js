import mongoose from 'mongoose';
import { Analytics, Property, Lead } from '../models/index.js';

// @desc    Track page view
// @route   POST /api/analytics/pageview
// @access  Public
export const trackPageView = async (req, res) => {
  try {
    const { propertyId, source, device } = req.body;

    // Skip if no propertyId
    if (!propertyId) {
      return res.json({ success: true, skipped: true });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Analytics.findOneAndUpdate(
      { propertyId, date: today },
      {
        $inc: {
          pageViews: 1,
          [`trafficSources.${source || 'direct'}`]: 1,
          [`devices.${device || 'desktop'}`]: 1,
        },
      },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Track page view error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Track CTA click
// @route   POST /api/analytics/cta
// @access  Public
export const trackCTAClick = async (req, res) => {
  try {
    const { propertyId, cta } = req.body;

    // Skip if no propertyId
    if (!propertyId) {
      return res.json({ success: true, skipped: true });
    }

    const validCTAs = ['getPriceDetails', 'bookSiteVisit', 'downloadBrochure', 'requestCallback', 'contactUs'];

    if (!validCTAs.includes(cta)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid CTA type',
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Analytics.findOneAndUpdate(
      { propertyId, date: today },
      { $inc: { [`ctaClicks.${cta}`]: 1 } },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Track CTA click error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private
export const getDashboardAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, propertyId } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Build match condition for analytics
    const analyticsMatch = {
      date: { $gte: start, $lte: end },
    };
    if (propertyId) {
      analyticsMatch.propertyId = new mongoose.Types.ObjectId(propertyId);
    }

    // Build match condition for leads
    const leadsMatch = {};
    if (propertyId) {
      leadsMatch.propertyId = new mongoose.Types.ObjectId(propertyId);
    }

    // Get total stats
    const totalProperties = await Property.countDocuments({ status: 'published' });
    const totalLeads = await Lead.countDocuments(leadsMatch);
    const newLeads = await Lead.countDocuments({ ...leadsMatch, status: 'new' });

    // Get analytics aggregation
    const analytics = await Analytics.aggregate([
      { $match: analyticsMatch },
      {
        $group: {
          _id: null,
          totalPageViews: { $sum: '$pageViews' },
          ctaClicks: {
            $sum: {
              $add: [
                { $ifNull: ['$ctaClicks.getPriceDetails', 0] },
                { $ifNull: ['$ctaClicks.bookSiteVisit', 0] },
                { $ifNull: ['$ctaClicks.downloadBrochure', 0] },
                { $ifNull: ['$ctaClicks.requestCallback', 0] },
                { $ifNull: ['$ctaClicks.contactUs', 0] },
              ],
            },
          },
        },
      },
    ]);

    // Get leads by status
    const leadsByStatus = await Lead.aggregate([
      { $match: leadsMatch },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get leads by source
    const leadsBySource = await Lead.aggregate([
      { $match: leadsMatch },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get daily page views
    const dailyPageViews = await Analytics.aggregate([
      { $match: analyticsMatch },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          pageViews: { $sum: '$pageViews' },
          leads: { $sum: '$leadsGenerated' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get top properties by views (only if not filtering by property)
    let topProperties = [];
    if (!propertyId) {
      topProperties = await Analytics.aggregate([
        { $match: { date: { $gte: start, $lte: end } } },
        {
          $group: {
            _id: '$propertyId',
            totalViews: { $sum: '$pageViews' },
            totalLeads: { $sum: '$leadsGenerated' },
          },
        },
        { $sort: { totalViews: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'properties',
            localField: '_id',
            foreignField: '_id',
            as: 'property',
          },
        },
        { $unwind: '$property' },
      ]);
    }

    // Get top telecallers (only if filtering by property) - ranked by converted leads
    let topTelecallers = [];
    if (propertyId) {
      topTelecallers = await Lead.aggregate([
        {
          $match: {
            propertyId: new mongoose.Types.ObjectId(propertyId),
            assignedTo: { $ne: null },
            status: 'converted',
          },
        },
        {
          $group: {
            _id: '$assignedTo',
            convertedLeads: { $sum: 1 },
          },
        },
        { $sort: { convertedLeads: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'telecaller',
          },
        },
        { $unwind: '$telecaller' },
        {
          $project: {
            _id: 1,
            count: '$convertedLeads',
            name: '$telecaller.name',
            email: '$telecaller.email',
            phone: '$telecaller.phone',
          },
        },
      ]);
    }

    res.json({
      success: true,
      data: {
        summary: {
          totalProperties: propertyId ? 1 : totalProperties,
          totalLeads,
          newLeads,
          ...analytics[0],
        },
        leadsByStatus,
        leadsBySource,
        dailyPageViews,
        topProperties,
        topTelecallers,
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get property analytics
// @route   GET /api/admin/analytics/:propertyId
// @access  Private
export const getPropertyAnalytics = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const analytics = await Analytics.find({
      propertyId,
      date: { $gte: start, $lte: end },
    }).sort('date');

    const leads = await Lead.find({ propertyId })
      .sort('-createdAt')
      .limit(10);

    res.json({
      success: true,
      data: {
        analytics,
        leads,
      },
    });
  } catch (error) {
    console.error('Get property analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};