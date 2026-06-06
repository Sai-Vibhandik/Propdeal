import { Analytics, Property, Lead } from '../models/index.js';

// @desc    Track page view
// @route   POST /api/analytics/pageview
// @access  Public
export const trackPageView = async (req, res) => {
  try {
    const { propertyId, source, device } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const analytics = await Analytics.findOneAndUpdate(
      { propertyId, date: today },
      {
        $inc: { pageViews: 1 },
        $inc: { [`trafficSources.${source || 'direct'}`]: 1 },
        $inc: { [`devices.${device || 'desktop'}`]: 1 },
      },
      { upsert: true, new: true }
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const validCTAs = ['getPriceDetails', 'bookSiteVisit', 'downloadBrochure', 'requestCallback', 'contactUs'];

    if (!validCTAs.includes(cta)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid CTA type',
      });
    }

    await Analytics.findOneAndUpdate(
      { propertyId, date: today },
      { $inc: { [`ctaClicks.${cta}`]: 1 } },
      { upsert: true, new: true }
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
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Get total stats
    const totalProperties = await Property.countDocuments({ status: 'published' });
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'new' });

    // Get analytics aggregation
    const analytics = await Analytics.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          totalPageViews: { $sum: '$pageViews' },
          totalUniqueVisitors: { $sum: '$uniqueVisitors' },
          totalLeads: { $sum: '$leadsGenerated' },
          ctaClicks: {
            $sum: {
              $add: [
                '$ctaClicks.getPriceDetails',
                '$ctaClicks.bookSiteVisit',
                '$ctaClicks.downloadBrochure',
                '$ctaClicks.requestCallback',
              ],
            },
          },
        },
      },
    ]);

    // Get leads by status
    const leadsByStatus = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get leads by source
    const leadsBySource = await Lead.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get daily page views
    const dailyPageViews = await Analytics.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          pageViews: { $sum: '$pageViews' },
          leads: { $sum: '$leadsGenerated' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get top properties by views
    const topProperties = await Analytics.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
        },
      },
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

    res.json({
      success: true,
      data: {
        summary: {
          totalProperties,
          totalLeads,
          newLeads,
          ...analytics[0],
        },
        leadsByStatus,
        leadsBySource,
        dailyPageViews,
        topProperties,
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