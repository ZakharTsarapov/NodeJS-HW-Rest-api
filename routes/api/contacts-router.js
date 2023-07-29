import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import contactsSchema from "../../Schemas/contacts-schemas.js";
import {validateBody} from "../../decorators/index.js";
import {authenticate, isEmptyBody, isValidId} from "../../middlewares/index.js";

const contactsRouter = express.Router()

contactsRouter.use(authenticate);

contactsRouter.get('/', contactsController.getAll)

contactsRouter.get('/:contactId', isValidId, contactsController.getById)

contactsRouter.post('/', isEmptyBody, validateBody(contactsSchema.addContactsSchema), contactsController.add)

contactsRouter.patch('/:contactId/favorite', isValidId, isEmptyBody, validateBody(contactsSchema.contactUpdateFavoriteSchema), contactsController.updateById)

contactsRouter.delete('/:contactId', isValidId, contactsController.deleteById)

contactsRouter.put('/:contactId', isValidId, isEmptyBody, validateBody(contactsSchema.addContactsSchema), contactsController.updateById)

export default contactsRouter;
