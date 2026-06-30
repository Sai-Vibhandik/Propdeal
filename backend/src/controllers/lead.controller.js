import { Lead, Property, User } from '../models/index.js';

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

    // Check if property has telecaller assignment with lead distribution enabled
    if (leadData.propertyId) {
      const property = await Property.findById(leadData.propertyId);

      if (property && property.distributeLeads && property.assignedTelecallers?.length > 0) {
        // Get all assigned telecallers and filter for active ones only
        const telecallerIds = property.assignedTelecallers;
        const activeTelecallers = await User.find({
          _id: { $in: telecallerIds },
          isActive: true,
          role: 'telecaller'
        }).select('_id');

        const activeTelecallerIds = activeTelecallers.map(t => t._id.toString());

        // Only assign if there are active telecallers
        if (activeTelecallerIds.length > 0) {
          // Round-robin assignment using only active telecallers
          // Find the index within active telecallers based on lastAssignedIndex
          const lastIndex = property.lastAssignedIndex || 0;
          const activeIndex = lastIndex % activeTelecallerIds.length;
          const nextIndex = (activeIndex + 1) % activeTelecallerIds.length;

          // Assign to next active telecaller in round-robin
          leadData.assignedTo = activeTelecallerIds[activeIndex];

          // Update the last assigned index for next lead
          await Property.findByIdAndUpdate(leadData.propertyId, {
            lastAssignedIndex: nextIndex
          });
        }
      }
    }

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
    // const {
    //   page = 1,
    //   limit = 20,
    //   status,
    //   propertyId,
    //   source,
    //   search,
    //   sort = '-createdAt',
    // } = req.query;

    const {
  page = 1,
  limit = 20,
  status,
  propertyId,
  source,
  search,
  startDate,
  endDate,
  sort = '-createdAt',
} = req.query;

    const query = {};

    if (status) query.status = status;
    if (propertyId) query.propertyId = propertyId;
    if (source) {
      // Support comma-separated sources for filtering multiple sources
      const sources = source.split(',').map(s => s.trim());
      query.source = sources.length === 1 ? sources[0] : { $in: sources };
    }
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
      ];
    }

    if (startDate || endDate) {
  query.createdAt = {};

  if (startDate) {
    query.createdAt.$gte = new Date(startDate);
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    query.createdAt.$lte = end;
  }
}

    const leads = await Lead.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('propertyId', 'name slug')
      .populate('assignedTo', 'name phone');

    const total = await Lead.countDocuments(query);

    // Get counts by status
    const statusCounts = await Lead.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const countsByStatus = {
      new: 0,
      'in-progress': 0,
      converted: 0,
      lost: 0,
    };

    statusCounts.forEach(item => {
      if (countsByStatus.hasOwnProperty(item._id)) {
        countsByStatus[item._id] = item.count;
      }
    });

    res.json({
      success: true,
      data: leads,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      statusCounts: countsByStatus,
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
      .populate('assignedTo', 'name phone');

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
      { returnDocument: 'after' }
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
      { returnDocument: 'after' }
    ).populate('assignedTo', 'name phone');

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
      { returnDocument: 'after' }
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
    const { status, propertyId, startDate, endDate, source } = req.query;

    const query = {};
    if (status) query.status = status;
    if (propertyId) query.propertyId = propertyId;
    if (source) {
      // Support comma-separated sources for filtering multiple sources
      const sources = source.split(',').map(s => s.trim());
      query.source = sources.length === 1 ? sources[0] : { $in: sources };
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const leads = await Lead.find(query)
      .populate('propertyId', 'name')
      .populate('assignedTo', 'name phone')
      .sort('-createdAt');

    // Format date helper
    const formatDate = (date) => {
      if (!date) return '';
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[d.getMonth()];
      const year = d.getFullYear();
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      hours = String(hours).padStart(2, '0');
      return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
    };

    // Status label helper
    const getStatusLabel = (status) => {
      const statusLabels = {
        'new': 'New',
        'in-progress': 'In Progress',
        'converted': 'Converted',
        'lost': 'Lost',
      };
      return statusLabels[status] || status || 'New';
    };

    // Format source helper
    const formatSource = (source) => {
      if (!source) return 'Website';
      return source.charAt(0).toUpperCase() + source.slice(1).replace(/-/g, ' ');
    };

    // Escape CSV cell value
    const escapeCSV = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Generate CSV headers
    const csvHeaders = ['Name', 'Phone', 'Email', 'Property', 'Assigned To', 'Source', 'Status', 'Date'];

    const csvRows = leads.map((lead) => [
      escapeCSV(lead.name),
      escapeCSV(lead.phone),
      escapeCSV(lead.email || ''),
      escapeCSV(lead.propertyId?.name || ''),
      escapeCSV(lead.assignedTo?.name || 'Unassigned'),
      escapeCSV(formatSource(lead.source)),
      escapeCSV(getStatusLabel(lead.status)),
      escapeCSV(formatDate(lead.createdAt)),
    ].join(','));

    const csv = [csvHeaders.join(','), ...csvRows].join('\n');

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

// @desc    Delete a lead
// @route   DELETE /api/admin/leads/:id
// @access  Private
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};