const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

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
  console.log("The request body is :", req.body);
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  // Check if email, phone, or name already exists
  const existingEmailContact = await Contact.findOne({ email });
  const existingPhoneContact = await Contact.findOne({ phone });
  const existingNameContact = await Contact.findOne({ name });

  if (existingEmailContact) {
    res.status(400);
    throw new Error("Email is already taken");
  }

  if (existingPhoneContact) {
    res.status(400);
    throw new Error("Phone number already registered");
  }

  if (existingNameContact) {
    res.status(400);
    throw new Error("Name is already registered");
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });

  res.status(201).json(contact);
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