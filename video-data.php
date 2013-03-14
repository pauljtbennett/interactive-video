<?php

$sections = array(
	array(
		'from' => 10000,
		'to' => 13500,
		'points' => array(
			array(
				'id' => 3,
				'price' => '650',
				'name' => 'Jacket',
				'x' => '300',
				'y' => '100',
			),
			array(
				'id' => 4,
				'price' => '400',
				'name' => 'Trousers',
				'x' => '650',
				'y' => '300',
			),
		),
	),
	array(
		'from' => 45000,
		'to' => 50000,
		'points' => array(
			array(
				'id' => 1,
				'price' => '650',
				'name' => 'Jacket',
				'x' => '300',
				'y' => '100',
			),
			array(
				'id' => 2,
				'price' => '400',
				'name' => 'Trousers',
				'x' => '650',
				'y' => '300',
			),
		),
	),	
);

echo json_encode($sections);