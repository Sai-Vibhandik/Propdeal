import { Enquiry } from '../models/index.js';

// @desc    Submit an enquiry (public)
// @route   POST /api/enquiries
// @access  Public
export const submitEnquiry = async (req, res) => {
  try {
    const enquiryData = req.body;

    const enquiry = await Enquiry.create(enquiryData);

    res.status(201).json({
      success: true,
      data: enquiry,
      message: 'Thank you for your interest. We will contact you soon.',
    });
  } catch (error) {
    console.error('Submit enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all enquiries (admin)
// @route   GET /api/admin/enquiries
// @access  Private
export const getEnquiries = async (req, res) => {
  try {
    const {
  page = 1,
  limit = 20,
  status,
  search,
  startDate,
  endDate,
  sort = '-createdAt',
} = req.query;

    const query = {};

    if (status) query.status = status;
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

    const enquiries = await Enquiry.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('assignedTo', 'name phone');

    const total = await Enquiry.countDocuments(query);

    // Get counts by status
    const statusCounts = await Enquiry.aggregate([
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
      data: enquiries,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      statusCounts: countsByStatus,
    });
  } catch (error) {
    console.error('Get enquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get single enquiry
// @route   GET /api/admin/enquiries/:id
// @access  Private
export const getEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate('assignedTo', 'name phone');

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    res.json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    console.error('Get enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update enquiry status
// @route   PUT /api/admin/enquiries/:id/status
// @access  Private
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: 'after' }
    ).populate('assignedTo', 'name phone');

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    res.json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    console.error('Update enquiry status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Add note to enquiry
// @route   POST /api/admin/enquiries/:id/notes
// @access  Private
export const addEnquiryNote = async (req, res) => {
  try {
    const { note } = req.body;

    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    enquiry.notes.push({
      note,
      addedBy: req.user._id,
      addedAt: new Date(),
    });

    await enquiry.save();

    res.json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    console.error('Add enquiry note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Assign enquiry to user
// @route   PUT /api/admin/enquiries/:id/assign
// @access  Private
export const assignEnquiry = async (req, res) => {
  try {
    const { userId } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userId },
      { returnDocument: 'after' }
    ).populate('assignedTo', 'name phone');

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    res.json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    console.error('Assign enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Set follow-up date
// @route   PUT /api/admin/enquiries/:id/followup
// @access  Private
export const setEnquiryFollowUp = async (req, res) => {
  try {
    const { date } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { nextFollowUp: date },
      { returnDocument: 'after' }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    res.json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    console.error('Set follow-up error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Export enquiries as CSV
// @route   GET /api/admin/enquiries/export
// @access  Private
export const exportEnquiries = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    const query = {};
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const enquiries = await Enquiry.find(query)
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
    const csvHeaders = ['Name', 'Phone', 'Email', 'Message', 'Assigned To', 'Status', 'Date'];

    const csvRows = enquiries.map((enquiry) => [
      escapeCSV(enquiry.name),
      escapeCSV(enquiry.phone),
      escapeCSV(enquiry.email || ''),
      escapeCSV(enquiry.message || ''),
      escapeCSV(enquiry.assignedTo?.name || 'Unassigned'),
      escapeCSV(getStatusLabel(enquiry.status)),
      escapeCSV(formatDate(enquiry.createdAt)),
    ].join(','));

    const csv = [csvHeaders.join(','), ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=enquiries.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export enquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Delete an enquiry
// @route   DELETE /api/admin/enquiries/:id
// @access  Private
export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    res.json({
      success: true,
      message: 'Enquiry deleted successfully',
    });
  } catch (error) {
    console.error('Delete enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};