import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import contactsSchema from "../../Schemas/contacts-schemas.js";
import {validateBody} from "../../decorators/index.js";
import {isEmptyBody} from "../../middlewares/index.js";

const contactsRouter = express.Router()

contactsRouter.get('/', contactsController.getAll)

contactsRouter.get('/:contactId', contactsController.getById)

contactsRouter.post('/', isEmptyBody, validateBody(contactsSchema.addContactsSchema), contactsController.add)

contactsRouter.delete('/:contactId', contactsController.deleteById)

contactsRouter.put('/:contactId', isEmptyBody, validateBody(contactsSchema.addContactsSchema), contactsController.updateById)

export default contactsRouter;
