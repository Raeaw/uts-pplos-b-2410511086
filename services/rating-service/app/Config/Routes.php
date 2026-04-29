<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->post('api/v1/rating', 'RatingController::create');
$routes->get('api/v1/rating', 'RatingController::index');