Contact Management System
This Contact Management System is designed to facilitate the creation, retrieval, updating, and deletion (CRUD) of contacts associated with users. 

DATABASE DESIGN
CONTACT MODEL
The Contact model stores information about each contact, including the associated user_id, name, email, and phone. All fields except user_id are required, ensuring essential contact details are provided.

USER MODEL
The User model manages user data, comprising username, email, and password fields. The email field is unique to each user and is used as a unique identifier for authentication.

FEATURES
1. Create: Add new contacts associated with a user.
2. Read: Retrieve contact details and user information.
3. Update: Modify contact information or user details.
4. Delete: Remove contacts or user accounts from the system.

TECHNOLOGIES USED
1. Node.js: Backend environment for running the application.
2. Express.js: Web framework for handling routes and requests.
3. MongoDB: Database system for storing contact and user data.
4. Mongoose: Object Data Modeling (ODM) library for MongoDB in Node.js.

API ENDPOINTS:-
1. GET /contacts: Retrieve all contacts.
2. POST /contacts: Add a new contact.
3. GET /contacts/:id: Retrieve a specific contact by ID.
4. PUT /contacts/:id: Update a contact by ID.
5. DELETE /contacts/:id: Delete a contact by ID.
