import { Lead } from '../models/index.js';

// @desc    Submit a lead (public)
// @route   POST /api/leads
// @access  Public
export const submitLead = async (req, res) => {
  try {
    const leadData = req.body;

    // Track UTM parameters if present
    leadData.utmSource = req.query.utm_source;
    leadData.utmMedium = req.query.utm_medium;
    leadData.utmCampaign = req.query.utm_campaign;

    const lead = await Lead.create(leadData);

    res.status(201).json({
      success: true,
      data: lead,
      message: 'Thank you for your interest. We will contact you soon.',
    });
  } catch (error) {
    console.error('Submit lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all leads (admin)
// @route   GET /api/admin/leads
// @access  Private
export const getLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      propertyId,
      search,
      sort = '-createdAt',
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (propertyId) query.propertyId = propertyId;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
      ];
    }

    const leads = await Lead.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('propertyId', 'name slug')
      .populate('assignedTo', 'name');

    const total = await Lead.countDocuments(query);

    res.json({
      success: true,
      data: leads,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get single lead
// @route   GET /api/admin/leads/:id
// @access  Private
export const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('propertyId', 'name slug')
      .populate('assignedTo', 'name');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update lead status
// @route   PUT /api/admin/leads/:id/status
// @access  Private
export const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('propertyId', 'name slug');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('Update lead status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Add note to lead
// @route   POST /api/admin/leads/:id/notes
// @access  Private
export const addLeadNote = async (req, res) => {
  try {
    const { note } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    lead.notes.push({
      note,
      addedBy: req.user._id,
      addedAt: new Date(),
    });

    await lead.save();

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('Add lead note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Assign lead to user
// @route   PUT /api/admin/leads/:id/assign
// @access  Private
export const assignLead = async (req, res) => {
  try {
    const { userId } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userId },
      { new: true }
    ).populate('assignedTo', 'name');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('Assign lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Set follow-up date
// @route   PUT /api/admin/leads/:id/followup
// @access  Private
export const setFollowUp = async (req, res) => {
  try {
    const { date } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { nextFollowUp: date },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('Set follow-up error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Export leads as CSV
// @route   GET /api/admin/leads/export
// @access  Private
export const exportLeads = async (req, res) => {
  try {
    const { status, propertyId, startDate, endDate } = req.query;

    const query = {};
    if (status) query.status = status;
    if (propertyId) query.propertyId = propertyId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const leads = await Lead.find(query)
      .populate('propertyId', 'name')
      .sort('-createdAt');

    // Generate CSV
    const csvHeaders = [
      'Name',
      'Email',
      'Phone',
      'Property',
      'Source',
      'Status',
      'Message',
      'Created At',
    ];

    const csvRows = leads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone,
      lead.propertyId?.name || '',
      lead.source,
      lead.status,
      lead.message || '',
      lead.createdAt.toISOString(),
    ]);

    const csv = [
      csvHeaders.join(','),
      ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};