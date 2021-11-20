<?php

/*
 * Example PHP implementation used for the index.html example
 */

// DataTables PHP library
include( "../lib/DataTables.php" );

// Alias Editor classes so they are easy to use
use
	DataTables\Editor,
	DataTables\Editor\Field, 
	DataTables\Editor\Format,
	DataTables\Editor\Mjoin,
	DataTables\Editor\Options,
	DataTables\Editor\Upload,
	DataTables\Editor\Validate,
	DataTables\Editor\ValidateOptions;

// Build our Editor instance and process the data coming from _POST
Editor::inst( $db, 'users' )
	->fields(
		Field::inst( 'id' ),
        Field::inst( 'fname' )
			->validator( Validate::notEmpty( ValidateOptions::inst()
				->message( 'A first name is required' )	
			) ),
		Field::inst( 'lname' )
			->validator( Validate::notEmpty( ValidateOptions::inst()
				->message( 'A last name is required' )	
			) ),
		Field::inst( 'email' )
			->validator( Validate::notEmpty( ValidateOptions::inst()
				->message( 'A Email is required' )	
			) ),
		Field::inst( 'address' )
			->validator( Validate::notEmpty( ValidateOptions::inst()
				->message( 'A Address is required' )	
			) ),
		Field::inst( 'birthday' )
			->validator( Validate::notEmpty( ValidateOptions::inst()
				->message( 'A Birthday is required' )	
			) ),
        Field::inst( 'trn' ),
		Field::inst( 'number' )
			->validator( Validate::notEmpty( ValidateOptions::inst()
				->message( 'A Number is required' )	
			) ),
		Field::inst( 'additional_number' ),
		Field::inst( 'gender' )
			->validator( Validate::notEmpty( ValidateOptions::inst()
				->message( 'A Gender is required' )	
			) ),
		Field::inst( 'recv_name' )
			->validator( Validate::notEmpty( ValidateOptions::inst()
				->message( 'A Reciever Name is required' )	
			) ),
		Field::inst( 'recv_address' )
			->validator( Validate::notEmpty( ValidateOptions::inst()
				->message( 'A Reciever Address is required' )	
			) ),
		Field::inst( 'recv_phone' )
			->validator( Validate::notEmpty( ValidateOptions::inst()
				->message( 'A Reciever Phone is required' )	
			) ),
		Field::inst( 'recv_email' )
			->validator( Validate::notEmpty( ValidateOptions::inst()
				->message( 'A Reciever Email is required' )	
			) ),
		Field::inst( 'account_cre_date' )
	)->where( 'role', 'user', '=' )
	->process( $_POST )
	->json();
