const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
const User = require("../models/userModel");

// @desc Get all contacts
// @route GET /api/contacts
// @access private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

// @desc create new contacts
// @route POST /api/contacts
// @access private
const createContact = asyncHandler(async (req, res) => {
  console.log("The request body is:", req.body);
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  try {
    // Check if a contact with the same email exists for the current user
    const existingEmailContact = await Contact.findOne({
      user_id: req.user.id,
      email,
    });

    if (existingEmailContact) {
      return res.status(400).json({ message: "Email is already saved" });
    }

    // Check if a contact with the same name exists for the current user
    const existingNameContact = await Contact.findOne({
      user_id: req.user.id,
      name,
    });

    if (existingNameContact) {
      return res.status(400).json({ message: "Name is already saved" });
    }

    // Check if a contact with the same phone exists for the current user
    const existingPhoneContact = await Contact.findOne({
      user_id: req.user.id,
      phone,
    });

    if (existingPhoneContact) {
      return res.status(400).json({ message: "Phone is already saved" });
    }

    // Create the contact if none of the fields already exist
    const contact = await Contact.create({
      name,
      email,
      phone,
      user_id: req.user.id,
    });

    res.status(201).json(contact);

    // Update the respective user's contacts array with the new contact reference
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { contacts: contact._id } },
      { new: true }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create contact" });
  }
});



// @desc Get Contact
// @route GET /api/contacts/:id
// @access private
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

// @desc update contacts
// @route PUT /api/contacts/:id
// @access private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user contacts");
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json(updatedContact);
});

// @desc delete contacts
// @route DELETE /api/contacts/:id
// @access private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to delete other user contacts");
  }

  await Contact.deleteOne({ _id: req.params.id });

  res.status(200).json({ message: "Contact deleted successfully" });
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
