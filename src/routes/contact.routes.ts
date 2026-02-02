import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller';

const router = Router();
const contactController = new ContactController();

router.post('/', contactController.createContact);
router.get('/', contactController.getContacts);
router.get('/:id', contactController.getContactById);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

export default router;