const express = require('express');
const {
    getAllReservations,
    getReservationById,
    updateReservationStatus,
    deleteReservation
} = require('../../controllers/admin/reservation.controller.js');

const router = express.Router();

router.get('/', getAllReservations);
router.get('/:id', getReservationById);
router.put('/:id/status', updateReservationStatus);
router.delete('/:id', deleteReservation); // Nuova rotta per la cancellazione

module.exports = router;