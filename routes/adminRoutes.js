const express = require('express');
const router = express.Router();

const adminController = require(
  '../controllers/adminController'
);

const adminDogadanjaController = require(
  '../controllers/adminDogadanjaController'
);

const {
  requireAdmin,
} = require('../middlewares/authMiddleware');

const upload = require(
  '../middlewares/uploadMiddleware'
);

/* Prijava i odjava */

router.get(
  '/login',
  adminController.showLogin
);

router.post(
  '/login',
  adminController.login
);

router.post(
  '/logout',
  requireAdmin,
  adminController.logout
);

/* Nadzorna ploča */

router.get(
  '/',
  requireAdmin,
  adminController.dashboard
);

/* Upravljanje običajima */

router.get(
  '/obicaji',
  requireAdmin,
  adminController.listObicaji
);

router.get(
  '/obicaji/novi',
  requireAdmin,
  adminController.showCreateObicaj
);

router.post(
  '/obicaji',
  requireAdmin,
  upload.single('naslovna_slika'),
  adminController.createObicaj
);

router.get(
  '/obicaji/:id/uredi',
  requireAdmin,
  adminController.showEditObicaj
);

router.post(
  '/obicaji/:id/uredi',
  requireAdmin,
  upload.single('naslovna_slika'),
  adminController.updateObicaj
);

router.post(
  '/obicaji/:id/obrisi',
  requireAdmin,
  adminController.deleteObicaj
);

/* Upravljanje događanjima */

router.get(
  '/dogadanja',
  requireAdmin,
  adminDogadanjaController.index
);

router.get(
  '/dogadanja/novo',
  requireAdmin,
  adminDogadanjaController.showCreate
);

router.post(
  '/dogadanja',
  requireAdmin,
  adminDogadanjaController.create
);

router.get(
  '/dogadanja/:id/uredi',
  requireAdmin,
  adminDogadanjaController.showEdit
);

router.post(
  '/dogadanja/:id/uredi',
  requireAdmin,
  adminDogadanjaController.update
);

router.post(
  '/dogadanja/:id/obrisi',
  requireAdmin,
  adminDogadanjaController.delete
);

module.exports = router;