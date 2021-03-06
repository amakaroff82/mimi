<?php

require_once '../include/DbHandler.php';
require_once '../include/PassHash.php';
require '.././libs/Slim/Slim.php';

require '../include/SimpleImage.php';


\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

// User id from db - Global Variable
$user_id = NULL;

$search = array("\n", "\r", "\u", "\t", "\f", "\b", "/", '"');
$replace = array("\\n", "\\r", "\\u", "\\t", "\\f", "\\b", "\/", "\"");


/**
 * Adding Middle Layer to authenticate every request
 * Checking if the request has valid api key in the 'Authorization' header
 */
function authenticate(\Slim\Route $route) {
    // Getting request headers
    $headers = apache_request_headers();
    $response = array();
    $app = \Slim\Slim::getInstance();

    // Verifying Authorization Header
    if (isset($headers['authorization']) || isset($headers['Authorization'])) {
        $db = new DbHandler();


        // get the api key        
	if(isset($headers['authorization'])){
		$api_key = $headers['authorization'];	
	} else {
		$api_key = $headers['Authorization'];	
	}

        // validating api key
        if (!$db->isValidApiKey($api_key)) {
            // api key is not present in users table
            $response["error"] = true;
            $response["message"] = "Access Denied. Invalid Api key = " . $api_key;
            echoRespnse(401, $response);
            $app->stop();
        } else {
            global $user_id;
            // get user primary key id
            $user_id = $db->getUserId($api_key);
        }
    } else {
        // api key is missing in header
        $response["error"] = true;
        $response["message"] = "Api key is missing";

        echoRespnse(400, $response);
        $app->stop();
    }
}

/**
 * ----------- METHODS WITHOUT AUTHENTICATION ---------------------------------
 */
/**
 * User Registration
 * url - /register
 * method - POST
 * params - name, email, password
 */
$app->post('/register', function() use ($app) {
            // check for required params
            verifyRequiredParams(array('name', 'email', 'password'));

            $response = array();

            $request_params = $_REQUEST;
            $name = $request_params['name'];
            $email = $request_params['email'];
            $password = $request_params['password'];

            // validating email address
            validateEmail($email);

            $db = new DbHandler();
            $res = $db->createUser($name, $email, $password);

            if ($res == USER_CREATED_SUCCESSFULLY) {
                $response["error"] = false;
                $response["message"] = "You are successfully registered";
                echoRespnse(201, $response);
            } else if ($res == USER_CREATE_FAILED) {
                $response["error"] = true;
                $response["message"] = "Oops! An error occurred while registereing";
                echoRespnse(400, $response);

            } else if ($res == USER_ALREADY_EXISTED) {
                $response["error"] = true;
                $response["message"] = "Sorry, this email already existed";
                echoRespnse(400, $response);
            } 
            // echo json response
        });

/**
 * User Login
 * url - /login
 * method - POST
 * params - email, password
 */
$app->post('/login', function() use ($app) {
            // check for required params
            verifyRequiredParams(array('email', 'password'));

            // reading post params
            $request_params = $_REQUEST;
            $email = $request_params['email'];
            $password = $request_params['password'];

            $response = array();

            $db = new DbHandler();
            // check for correct email and password
            if ($db->checkLogin($email, $password)) {
                // get the user by email
                $user = $db->getUserByEmail($email);

                if ($user != NULL) {
                    $response["error"] = false;
                    $response['name'] = $user['name'];
                    $response['email'] = $user['email'];
                    $response['apiKey'] = $user['api_key'];
                    $response['createdAt'] = $user['created_at'];
		    if($user['isAdmin']){
                    	$response['isAdmin'] = $user['isAdmin'];
		    }
                } else {
                    // unknown error occurred
                    $response['error'] = true;
                    $response['message'] = "An error occurred. Please try again";
                }
            } else {
                // user credentials are wrong
                $response['error'] = true;
                $response['message'] = 'Login failed. Incorrect credentials';
            }

            echoRespnse(200, $response);
        });



/**
 * Listing all products
 * method POST
 * url /products
 */

$app->post('/products', function() use ($app)  {
	$response = array();
	$db = new DbHandler();

            // fetching all user tasks
	$result = $db->getProducts();

	$response["error"] = false;
	$response["products"] = $result;

	echoRespnse(200, $response);
});


/**
 * Listing all products
 * method POST
 * url /products
 */

$app->post('/newOrder', function() use ($app)  {
        $json = $app->request->getBody();
        $data = json_decode($json, true); // parse the JSON into an assoc. array


        $headers = apache_request_headers();

        $h = $headers;

	if(isset($h['authorization'])){
		$api_key = $h['authorization'];	
	} else {
		$api_key = $h['Authorization'];	
	}



	$email = $data['email'];
	$client_name = $data['client_name'];
	$city = $data['city'];
	$numb_nova_poshta = $data['numb_nova_poshta'];
	$shipping_type = $data['shipping_type'];
	$phone = $data['phone'];

        $order = str_replace($search, $replace, $data['order']);

	$db = new DbHandler();  

	$user_id = null;

	if($api_key){
        	$user_id = $db->getUserId($api_key);
	}

	$result = $db->newOrder($email, $user_id, $client_name, $city, $numb_nova_poshta, $shipping_type, $phone, $order);


	$response = array();
	$response["error"] = false;
	$response["result"] = $result;
//	$response["result"] = $user_id."  ".$client_name."  ".$city."  ".$numb_nova_poshta."  ".$shipping_type." ".$phone."  ".$order;

	echoRespnse(200, $response);
});



/**
 * Listing product images
 * method POST
 * url /productImages
 */

$app->post('/productImages', function() use ($app)  {

       $json = $app->request->getBody();
       $data = json_decode($json, true); // parse the JSON into an assoc. array

	$product_id = $data['product_id'];
	$response = array();
	$db = new DbHandler();

            // fetching all user tasks
	$result = $db->getProductImages($product_id);

	$response["error"] = false;
	$response["productImages"] = $result;
	$response["product_id"] = $product_id;

	echoRespnse(200, $response);
});









/**
 * Listing all product types
 * method POST
 * url /productTypes
 */

$app->post('/productTypes', function() use ($app)  {
	$response = array();
	$db = new DbHandler();

            // fetching all user tasks
	$result = $db->getProductTypes();

	$response["error"] = false;
	$response["productTypes"] = $result;

	echoRespnse(200, $response);
});



/**
 * Add new product
 * method POST
 * url /productTypes
 */


$app->post('/newProduct', 'authenticate', function() {
        global $user_id;
	$response = array();
	$db = new DbHandler();

        $user = $db->getUserByUserId($user_id);

        if ($user != NULL && $user['isAdmin']) {
            $app = \Slim\Slim::getInstance();

            $json = $app->request->getBody();
            $data = json_decode($json, true); // parse the JSON into an assoc. array

            $result = $db->newProduct($data['title'], $data['type'], $data['price'], $data['price_old'], $data['description'], $data['count']);

	    $response["error"] = false;
	    $response["result"] = $result;
            echoRespnse(200, $response);
        }   
        else{
	    $response["error"] = true;
	    $response["result"] = "Forbidden";
            echoRespnse(403, $response);
        }
	
});



/**
 * Update product
 * method POST
 * url /
 */


$app->post('/updateProduct', 'authenticate', function() {
        global $user_id;
	$response = array();
	$db = new DbHandler();

        $user = $db->getUserByUserId($user_id);

        if ($user != NULL && $user['isAdmin']) {
            $app = \Slim\Slim::getInstance();

            $json = $app->request->getBody();
            $data = json_decode($json, true); // parse the JSON into an assoc. array

            $result = $db->updateProduct($data['id'], $data['title'], $data['type'], $data['sold'], $data['price'], $data['price_old'], $data['description'], $data['count']);

	    $response["error"] = false;
	    $response["result"] = $result;
            echoRespnse(200, $response);
        }   
        else{
	    $response["error"] = true;
	    $response["result"] = "Forbidden";
            echoRespnse(403, $response);
        }
	
});



/**
 * Add new product
 * method POST
 * url /setDefaultImage
 */


$app->post('/setDefaultImage', 'authenticate', function() {
        global $user_id;
	$response = array();
	$db = new DbHandler();

        $user = $db->getUserByUserId($user_id);

        if ($user != NULL && $user['isAdmin']) {

            $app = \Slim\Slim::getInstance();

            $json = $app->request->getBody();
            $data = json_decode($json, true); // parse the JSON into an assoc. array

            $result = $db->setDefaultImage($data['product_id'], $data['image_id']);

	    $response["error"] = false;
	    $response["result"] = $data['product_id'] . "  -  " . $data['image_id'];
            echoRespnse(200, $response);
        }   
        else{
	    $response["error"] = true;
	    $response["result"] = "Forbidden";
            echoRespnse(403, $response);
        }
	
});

$app->post('/deleteImage', 'authenticate', function() {
        global $user_id;
	$response = array();
	$db = new DbHandler();

	
        $user = $db->getUserByUserId($user_id);

        if ($user != NULL && $user['isAdmin']) {

            $app = \Slim\Slim::getInstance();

            $json = $app->request->getBody();
            $data = json_decode($json, true); // parse the JSON into an assoc. array

            $result = $db->deleteImage($data['image_id']);

	    $response["error"] = false;
	    $response["result"] =  'OK';
            echoRespnse(200, $response);
        }   
        else{
	    $response["error"] = true;
	    $response["result"] = "Forbidden";
            echoRespnse(403, $response);
        }

});


$app->post('/deleteProduct', 'authenticate', function() {
        global $user_id;
	$response = array();
	$db = new DbHandler();

	
        $user = $db->getUserByUserId($user_id);

        if ($user != NULL && $user['isAdmin']) {

            $app = \Slim\Slim::getInstance();

            $json = $app->request->getBody();
            $data = json_decode($json, true); // parse the JSON into an assoc. array

            $result = $db->deleteProduct($data['product_id']);

	    $response["error"] = false;
	    $response["result"] =  'OK';
            echoRespnse(200, $response);
        }   
        else{
	    $response["error"] = true;
	    $response["result"] = "Forbidden";
            echoRespnse(403, $response);
        }

});



/**
 * Listing all orders
 * method GET
 * url /tasks          
 */
$app->get('/orders', 'authenticate', function() {


        global $user_id;
	$response = array();
	$db = new DbHandler();

	
        $user = $db->getUserByUserId($user_id);

        if ($user != NULL && $user['isAdmin']) {

            $app = \Slim\Slim::getInstance();

            /*$json = $app->request->getBody();
            $data = json_decode($json, true); // parse the JSON into an assoc. array*/

            $result = $db->getOrders();

	    $response["orders"] =  $result;
            echoRespnse(200, $response);
        }   
        else{
	    $response["error"] = true;
	    $response["result"] = "Forbidden";
            echoRespnse(403, $response);
        }

        });






/**
 * Listing all orders
 * method GET
 * url /tasks          
 */
$app->get('/order', 'authenticate', function() {


        global $user_id;
	$response = array();
	$db = new DbHandler();

	
        $user = $db->getUserByUserId($user_id);

        if ($user != NULL && $user['isAdmin']) {

            $app = \Slim\Slim::getInstance();

            $json = $app->request->getBody();
            $data = json_decode($json, true); // parse the JSON into an assoc. array

            $result = $db->getOrder($data["id"]);

	    $response["order"] =  $result;
            echoRespnse(200, $response);
        }   
        else{
	    $response["error"] = true;
	    $response["result"] = "Forbidden";
            echoRespnse(403, $response);
        }

        });






/**
 * Add new product
 * method POST
 * url /productTypes
 */


$app->post('/upload/:product_id', 'authenticate', function($product_id) {
        global $user_id;
	$response = array();
	$db = new DbHandler();

        $user = $db->getUserByUserId($user_id);

        if ($user != NULL && $user['isAdmin']) {

for($i=0; $i<count($_FILES['files']['name']); $i++) {
  //Get the temp file path
  $tmpFilePath = $_FILES['files']['tmp_name'][$i];

  //Make sure we have a filepath
  if ($tmpFilePath != ""){
    //Setup our new file path
    $name = $_FILES['files']['name'][$i];

    $name=str_replace(" ","_",$name);

    $newFilePath = rand(1,100000).$value . "_"  . $name;

    //Upload the file into the temp dir
    if(move_uploaded_file($tmpFilePath, "../images/" . $newFilePath)) {
	try {
	    $img = new abeautifulsite\SimpleImage( "../images/" . $newFilePath);
	    $img->thumbnail(160,160)->save( "../images/thumb/" .  $newFilePath);
            $result = "ok";

            $res = $db->saveImageByProductId($product_id, $newFilePath);

	} catch(Exception $e) {
	    $result = 'Error: ' . $e->getMessage();
	}


      //Handle other code here

    }
  }
} 

            /*$result = $_FILES['files'];*/
	    $response["error"] = false;
	    $response["result"] = $result;
            echoRespnse(200, $response);


        }   
        else{
	    $response["error"] = true;
	    $response["result"] = "Forbidden";
            echoRespnse(403, $response);
        }
	
});






/*
 * ------------------------ METHODS WITH AUTHENTICATION ------------------------
 */


/**
 * Listing all tasks of particual user
 * method GET
 * url /tasks          
 */
$app->get('/userData', 'authenticate', function() {
            global $user_id;
            $response = array();
            $db = new DbHandler();

                $user = $db->getUserByUserId($user_id);

                if ($user != NULL) {
                    $response["error"] = false;
                    $response['name'] = $user['name'];
                    $response['email'] = $user['email'];
                    $response['apiKey'] = $user['api_key'];
                    $response['createdAt'] = $user['created_at'];
		    if($user['isAdmin']){
                    	$response['isAdmin'] = $user['isAdmin'];
		    }
                } else {
                    // unknown error occurred
                    $response['error'] = true;
                    $response['message'] = "An error occurred. Please try again";
                }

            echoRespnse(200, $response);
        });


/**
 * Listing all tasks of particual user
 * method GET
 * url /tasks          
 */
$app->get('/tasks', 'authenticate', function() {
            global $user_id;
            $response = array();
            $db = new DbHandler();

            // fetching all user tasks
            $result = $db->getAllUserTasks($user_id);

            $response["error"] = false;
            $response["tasks"] = array();

            // looping through result and preparing tasks array
            while ($task = $result->fetch_assoc()) {
                $tmp = array();
                $tmp["id"] = $task["id"];
                $tmp["task"] = $task["task"];
                $tmp["status"] = $task["status"];
                $tmp["createdAt"] = $task["created_at"];
                array_push($response["tasks"], $tmp);
            }

            echoRespnse(200, $response);
        });

/**
 * Listing single task of particual user
 * method GET
 * url /tasks/:id
 * Will return 404 if the task doesn't belongs to user
 */
$app->get('/tasks/:id', 'authenticate', function($task_id) {
            global $user_id;
            $response = array();
            $db = new DbHandler();

            // fetch task
            $result = $db->getTask($task_id, $user_id);

            if ($result != NULL) {
                $response["error"] = false;
                $response["id"] = $result["id"];
                $response["task"] = $result["task"];
                $response["status"] = $result["status"];
                $response["createdAt"] = $result["created_at"];
                echoRespnse(200, $response);
            } else {
                $response["error"] = true;
                $response["message"] = "The requested resource doesn't exists";
                echoRespnse(404, $response);
            }
        });

/**
 * Creating new task in db
 * method POST
 * params - name
 * url - /tasks/
 */
$app->post('/tasks', 'authenticate', function() use ($app) {
            // check for required params
            verifyRequiredParams(array('task'));

            $response = array();
            $task = $app->request->post('task');

            global $user_id;
            $db = new DbHandler();

            // creating new task
            $task_id = $db->createTask($user_id, $task);

            if ($task_id != NULL) {
                $response["error"] = false;
                $response["message"] = "Task created successfully";
                $response["task_id"] = $task_id;
                echoRespnse(201, $response);
            } else {
                $response["error"] = true;
                $response["message"] = "Failed to create task. Please try again";
                echoRespnse(200, $response);
            }            
        });

/**
 * Updating existing task
 * method PUT
 * params task, status
 * url - /tasks/:id
 */
$app->put('/tasks/:id', 'authenticate', function($task_id) use($app) {
            // check for required params
            verifyRequiredParams(array('task', 'status'));

            global $user_id;            
            $task = $app->request->put('task');
            $status = $app->request->put('status');

            $db = new DbHandler();
            $response = array();

            // updating task
            $result = $db->updateTask($user_id, $task_id, $task, $status);
            if ($result) {
                // task updated successfully
                $response["error"] = false;
                $response["message"] = "Task updated successfully";
            } else {
                // task failed to update
                $response["error"] = true;
                $response["message"] = "Task failed to update. Please try again!";
            }
            echoRespnse(200, $response);
        });

/**
 * Deleting task. Users can delete only their tasks
 * method DELETE
 * url /tasks
 */
$app->delete('/tasks/:id', 'authenticate', function($task_id) use($app) {
            global $user_id;

            $db = new DbHandler();
            $response = array();
            $result = $db->deleteTask($user_id, $task_id);
            if ($result) {
                // task deleted successfully
                $response["error"] = false;
                $response["message"] = "Task deleted succesfully";
            } else {
                // task failed to delete
                $response["error"] = true;
                $response["message"] = "Task failed to delete. Please try again!";
            }
            echoRespnse(200, $response);
        });

/**
 * Verifying required params posted or not
 */
function verifyRequiredParams($required_fields) {
    $error = false;
    $error_fields = "";
    $request_params = array();
    $request_params = $_REQUEST;
    // Handling PUT request params
    if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
        $app = \Slim\Slim::getInstance();
        parse_str($app->request()->getBody(), $request_params);
    }
    foreach ($required_fields as $field) {
        if (!isset($request_params[$field]) || strlen(trim($request_params[$field])) <= 0) {
            $error = true;
            $error_fields .= $field . ', ';
        }
    }

    if ($error) {
        // Required field(s) are missing or empty
        // echo error json and stop the app
        $response = array();
        $app = \Slim\Slim::getInstance();
        $response["error"] = true;
        $response["message"] = 'Required field(s) ' . substr($error_fields, 0, -2) . ' is missing or empty';
        echoRespnse(400, $response);
        $app->stop();
    }
}

/**
 * Validating email address
 */
function validateEmail($email) {
    $app = \Slim\Slim::getInstance();
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response["error"] = true;
        $response["message"] = 'Email address is not valid: ' . $email;
        echoRespnse(400, $response);
        $app->stop();
    }
}

/**
 * Echoing json response to client
 * @param String $status_code Http response code
 * @param Int $response Json response
 */
function echoRespnse($status_code, $response) {
    $app = \Slim\Slim::getInstance();
    // Http response code
    $app->status($status_code);

    // setting response content type to json
    $app->contentType('application/json; charset=utf-8');

    echo json_encode($response);
}

$app->run();
?>