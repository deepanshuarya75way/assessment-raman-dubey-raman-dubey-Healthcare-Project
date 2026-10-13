import Contact from '../models/contactModel.js'

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please fill all fields.' })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email.' })
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    })

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.'
    })

  } catch (error) {
    console.error('Contact submit error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Get all contact messages (admin)
// @route   GET /api/admin/contacts
// @access  Admin
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json({ success: true, contacts })
  } catch (error) {
    console.error('Get contacts error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Update contact status (admin)
// @route   PUT /api/admin/contacts/:id
// @access  Admin
export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found.' })
    }

    res.json({ success: true, contact, message: 'Status updated.' })
  } catch (error) {
    console.error('Update contact error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}
