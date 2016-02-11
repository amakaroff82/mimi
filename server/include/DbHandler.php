7<?php

/**
 * Class to handle all db operations
 * This class will have CRUD methods for database tables
 *
 * @author Ravi Tamada
 * @link URL Tutorial link
 */
class DbHandler {

    private $conn;

    function __construct() {
        require_once dirname(__FILE__) . '/DbConnect.php';
        // opening db connection
        $db = new DbConnect();
        $this->conn = $db->connect();
    }

    /* ------------- `users` table method ------------------ */

    /**
     * Creating new user
     * @param String $name User full name
     * @param String $email User login email id
     * @param String $password User login password
     */
    public function createUser($name, $email, $password) {
        require_once 'PassHash.php';
        $response = array();

        // First check if user already existed in db
        if (!$this->isUserExists($email)) {
            // Generating password hash
            $password_hash = PassHash::hash($password);

            // Generating API key
            $api_key = $this->generateApiKey();

            // insert query
            $stmt = $this->conn->prepare("INSERT INTO users(name, email, password_hash, api_key, status) values(?, ?, ?, ?, 1)");
            $stmt->bind_param("ssss", $name, $email, $password_hash, $api_key);

            $result = $stmt->execute();

            $stmt->close();

            // Check for successful insertion
            if ($result) {
                // User successfully inserted
                return USER_CREATED_SUCCESSFULLY;
            } else {
                // Failed to create user
                return USER_CREATE_FAILED;
            }
        } else {
            // User with same email already existed in the db
            return USER_ALREADY_EXISTED;
        }

        return $response;
    }

    /**
     * Checking user login
     * @param String $email User login email id
     * @param String $password User login password
     * @return boolean User login status success/fail
     */
    public function checkLogin($email, $password) {
        // fetching user by email
        $stmt = $this->conn->prepare("SELECT password_hash FROM users WHERE email = ?");

        $stmt->bind_param("s", $email);

        $stmt->execute();

        $stmt->bind_result($password_hash);

        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            // Found user with the email
            // Now verify the password

            $stmt->fetch();

            $stmt->close();

            if (PassHash::check_password($password_hash, $password)) {
                // User password is correct
                return TRUE;
            } else {
                // user password is incorrect
                return FALSE;
            }
        } else {
            $stmt->close();

            // user not existed with the email
            return FALSE;
        }
    }

    /**
     * Checking for duplicate user by email address
     * @param String $email email to check in db
     * @return boolean
     */
    private function isUserExists($email) {
        $stmt = $this->conn->prepare("SELECT id from users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }

    /**
     * Fetching user by email
     * @param String $email User email id
     */
    public function getUserByEmail($email) {
        $stmt = $this->conn->prepare("SELECT name, email, api_key, status, created_at, isAdmin FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        if ($stmt->execute()) {
            // $user = $stmt->get_result()->fetch_assoc();
            $stmt->bind_result($name, $email, $api_key, $status, $created_at, $isAdmin);
            $stmt->fetch();
            $user = array();
            $user["name"] = $name;
            $user["email"] = $email;
            $user["api_key"] = $api_key;
            $user["status"] = $status;
            $user["created_at"] = $created_at;
            $user["isAdmin"] = $isAdmin;
            $stmt->close();
            return $user;
        } else {
            return NULL;
        }
    }


    /**
     * Fetching user by api key
     * @param String $apiKey api key
     */
    public function getUserByUserId($userId) {
        $stmt = $this->conn->prepare("SELECT name, email, api_key, status, created_at, isAdmin FROM users WHERE id = ?");
        $stmt->bind_param("i", $userId);
        if ($stmt->execute()) {
            // $user = $stmt->get_result()->fetch_assoc();
            $stmt->bind_result($name, $email, $api_key, $status, $created_at, $isAdmin);
            $stmt->fetch();
            $user = array();
            $user["name"] = $name;
            $user["email"] = $email;
            $user["api_key"] = $api_key;
            $user["status"] = $status;
            $user["created_at"] = $created_at;
            $user["isAdmin"] = $isAdmin;
            $stmt->close();
            return $user;
        } else {
            return NULL;
        }
    }


    /**
     * Fetching user api key
     * @param String $user_id user id primary key in user table
     */
    public function getApiKeyById($user_id) {
        $stmt = $this->conn->prepare("SELECT api_key FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        if ($stmt->execute()) {
            // $api_key = $stmt->get_result()->fetch_assoc();
            // TODO
            $stmt->bind_result($api_key);
            $stmt->close();
            return $api_key;
        } else {
            return NULL;
        }
    }

    /**
     * Fetching user id by api key
     * @param String $api_key user api key
     */
    public function getUserId($api_key) {
        $stmt = $this->conn->prepare("SELECT id FROM users WHERE api_key = ?");
        $stmt->bind_param("s", $api_key);
        if ($stmt->execute()) {
            $stmt->bind_result($user_id);
            $stmt->fetch();
            // TODO
            // $user_id = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            return $user_id;
        } else {
            return NULL;
        }
    }

    /**
     * Validating user api key
     * If the api key is there in db, it is a valid key
     * @param String $api_key user api key
     * @return boolean
     */
    public function isValidApiKey($api_key) {
        $stmt = $this->conn->prepare("SELECT id from users WHERE api_key = ?");
        $stmt->bind_param("s", $api_key);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }

    /**
     * Generating random Unique MD5 String for user Api key
     */
    private function generateApiKey() {
        return md5(uniqid(rand(), true));
    }

    /* ------------- `tasks` table method ------------------ */

    /**
     * Creating new task
     * @param String $user_id user id to whom task belongs to
     * @param String $task task text
     */
    public function createTask($user_id, $task) {
        $stmt = $this->conn->prepare("INSERT INTO tasks(task) VALUES(?)");
        $stmt->bind_param("s", $task);
        $result = $stmt->execute();
        $stmt->close();

        if ($result) {
            // task row created
            // now assign the task to user
            $new_task_id = $this->conn->insert_id;
            $res = $this->createUserTask($user_id, $new_task_id);
            if ($res) {
                // task created successfully
                return $new_task_id;
            } else {
                // task failed to create
                return NULL;
            }
        } else {
            // task failed to create
            return NULL;
        }
    }


    /**
     * Send email
     * @param String $to 
     * @param String $subject 
     * @param String $body 
     */
    public function sendEmail($to, $subject, $body) {
	$headers = 'From: mimishop2016@gmail.com' . "\r\n" .
		   'Reply-To: mimishop2016@gmail.com' . "\r\n" .
		   'X-Mailer: PHP/' . phpversion();

	mail($to, $subject, $body, $headers);
    }                                               



    /**
     * Create new order
     * @param String $email 
     * @param String $user_id 
     * @param String $client_name 
     * @param String $city 
     * @param String $numb_nova_poshta 
     * @param String $shipping_type
     * @param String $phone 
     * @param String $order 
     */
    public function newOrder($email, $user_id, $client_name, $city, $numb_nova_poshta, $shipping_type, $phone, $order) {
            $stmt = $this->conn->prepare("INSERT INTO orders(email, user_id, client_name, city, numb_nova_poshta, shipping_type, phone, orders.order, state) VALUES(?, ?, ?, ?, ?, ?, ?, ?, 0)");
            $stmt->bind_param("sissiiss", $email, $user_id, $client_name, $city, $numb_nova_poshta, $shipping_type, $phone, $order);

            $stmt->execute();

            $params = array();            
	    $params['id'] = mysqli_insert_id($this->conn);

	    $this->sendEmail($email, "MiMi-Shop", "Спасибо за Ваш выбор! Ваш заказ отправлен в обработку, в ближайшее время с Вами свяжется наш менеджер");

	    //$this->sendEmail("amakaroff82@gmail.com", "MiMi-Shop", "");
	    $this->sendEmail("diatelirina@gmail.com", "MiMi-Shop", "New Order");

            $stmt->close();

            return $params;
    }



    /**
     * Get orders
     */
    public function getOrders() {
        $stmt = $this->conn->prepare('SELECT * FROM orders');
        $stmt->execute();
        $stmt->bind_result($id, $email, $user_id, $client_name, $city, $numb_nova_poshta, $shipping_type, $created, $state, $phone, $order );

        $orders = array();
                
	while($stmt->fetch()){
		$res = array();
		$res['id'] = $id;
		$res['email'] = $email;
		$res['user_id'] = $user_id;
		$res['client_name'] = $client_name; 
		$res['city'] = $city; 
		$res['numb_nova_poshta'] = $numb_nova_poshta; 
		$res['shipping_type'] = $shipping_type;
		$res['created'] = $created;
		$res['state'] = $state;
		$res['phone'] = $phone;
		$res['order'] = $order;

		array_push($orders, $res);
	}
		

        $stmt->close();
        return $orders;
    }                  



    /**
     * Get orders
     */
    public function getOrder($order_id) {
        $stmt = $this->conn->prepare('SELECT * FROM orders WHERE id = ?');
        $stmt->execute();
        $stmt->bind_result($id, $email, $user_id, $client_name, $city, $numb_nova_poshta, $shipping_type, $created, $state, $phone, $order, $order_id);

        $orders = array();
                
	while($stmt->fetch()){
		$res = array();
		$res['id'] = $id;
		$res['email'] = $email;
		$res['user_id'] = $user_id;
		$res['client_name'] = $client_name; 
		$res['city'] = $city; 
		$res['numb_nova_poshta'] = $numb_nova_poshta; 
		$res['shipping_type'] = $shipping_type;
		$res['created'] = $created;
		$res['state'] = $state;
		$res['phone'] = $phone;
		$res['order'] = $order;

		array_push($orders, $res);
	}
		

        $stmt->close();
        return $orders[0];
    }                  


    /**
     * Fetching single task
     * @param String $task_id id of the task
     */
    public function getTask($task_id, $user_id) {
        $stmt = $this->conn->prepare("SELECT t.id, t.task, t.status, t.created_at from tasks t, user_tasks ut WHERE t.id = ? AND ut.task_id = t.id AND ut.user_id = ?");
        $stmt->bind_param("ii", $task_id, $user_id);
        if ($stmt->execute()) {
            $res = array();
            $stmt->bind_result($id, $task, $status, $created_at);
            // TODO
            // $task = $stmt->get_result()->fetch_assoc();
            $stmt->fetch();
            $res["id"] = $id;
            $res["task"] = $task;
            $res["status"] = $status;
            $res["created_at"] = $created_at;
            $stmt->close();
            return $res;
        } else {
            return NULL;
        }
    }

    /**
     * Fetching all user tasks
     * @param String $user_id id of the user
     */
    public function getAllUserTasks($user_id) {
        $stmt = $this->conn->prepare("SELECT t.* FROM tasks t, user_tasks ut WHERE t.id = ut.task_id AND ut.user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $tasks = $stmt->get_result();
        $stmt->close();
        return $tasks;
    }

    /**
     * Fetching all products
     */
    public function getProducts() {
        $stmt = $this->conn->prepare('SELECT p.id, p.title, p.type, p.price, p.price_old, p.sold, p.description, p.count, coalesce(i.path, "") FROM product p LEFT JOIN images i ON p.default_image_id=i.id');
        $stmt->execute();
        $stmt->bind_result($id, $title, $type, $price, $price_old, $sold, $description, $count, $path);

        $products = array();
                
	while($stmt->fetch()){
		$res = array();
		$res['id'] = $id;
		$res['title'] = $title;
		$res['type'] = $type;
		$res['price'] = $price; 
		$res['price_old'] = $price_old; 
		$res['sold'] = $sold; 
		$res['description'] = $description;
		$res['count'] = $count;
		$res['path'] = $path;

		array_push($products, $res);
	}
		

        $stmt->close();
        return $products;
    }


    /**
     * Fetching Product Images
     * @param String $product_id id of the user
     */
    public function getProductImages($product_id) {

        $stmt = $this->conn->prepare('SELECT i.id, i.path FROM images i where i.product_id = ?');
        $stmt->bind_param("i", $product_id);
        $stmt->execute();
        $stmt->bind_result($id, $path);

        $productImages = array();
                
	while($stmt->fetch()){
		$res = array();
		$res['id'] = $id;
		$res['path'] = $path;

		array_push($productImages, $res);
	}
		

        $stmt->close();
        return $productImages;
    }



    /**
     * Add new product
     */
    public function newProduct($title, $type, $price, $price_old, $description, $count) {
            $stmt = $this->conn->prepare("INSERT INTO product(title, type, price, price_old, description, count) values(?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sisssi", $title, $type, $price, $price_old, $description, $count);

            $stmt->execute();

            $params = array();            
	    $params['id'] = mysqli_insert_id($this->conn);

            $stmt->close();

            return $params;
    }


    /**
     * Update product
     */
    public function updateProduct($id, $title, $type, $sold, $price, $price_old, $description, $count) {
            $stmt = $this->conn->prepare("UPDATE product p set  p.title = ?, p.type = ?, p.sold = ?, p.price = ?, p.price_old = ?, p.description = ?, p.count = ? WHERE p.id = ?");
            $stmt->bind_param("siisssii", $title, $type, $sold, $price, $price_old, $description, $count, $id);

            $result = $stmt->execute();

            $stmt->close();
    }


    /**
     * Set default image
     */
    public function setDefaultImage($product_id, $image_id) {

            $stmt = $this->conn->prepare("UPDATE product p set p.default_image_id = ? WHERE p.id = ?");
            $stmt->bind_param("ii", $image_id, $product_id);

            $result = $stmt->execute();

            $stmt->close();
    }


    /**
     * Add new image
     */
    public function saveImageByProductId($product_id, $path) {
            $stmt = $this->conn->prepare("INSERT INTO images(product_id, path, priority) values(?, ?, 0)");
            $stmt->bind_param("is", $product_id, $path);

            $result = $stmt->execute();

            $stmt->close();
            return $result;
    }


    /**
     * Delete image
     */
    public function deleteImage($image_id) {
            $stmt = $this->conn->prepare("DELETE i FROM images i WHERE i.id = ?");
            $stmt->bind_param("i", $image_id);

            $result = $stmt->execute();

            $stmt->close();
            return $result;
    }



    /**
     * Delete product
     */
    public function deleteProduct($product_id) {
            $stmt = $this->conn->prepare("DELETE p FROM product p WHERE p.id = ?");
            $stmt->bind_param("i", $product_id);

            $result = $stmt->execute();

            $stmt->close();
            return $result;
    }




    /**
     * Fetching all product types
     */
    public function getProductTypes() {
        $stmt = $this->conn->prepare("SELECT * FROM productType");
        $stmt->execute();
        $stmt->bind_result($id, $name);

        $productTypes = array();
                
	while($stmt->fetch()){
		$res = array();
		$res['id'] = $id;
		$res['name'] = $name;
		array_push($productTypes, $res);
	}
		

        $stmt->close();
        return $productTypes;
    }

    /**
     * Updating task
     * @param String $task_id id of the task
     * @param String $task task text
     * @param String $status task status
     */
    public function updateTask($user_id, $task_id, $task, $status) {
        $stmt = $this->conn->prepare("UPDATE tasks t, user_tasks ut set t.task = ?, t.status = ? WHERE t.id = ? AND t.id = ut.task_id AND ut.user_id = ?");
        $stmt->bind_param("siii", $task, $status, $task_id, $user_id);
        $stmt->execute();
        $num_affected_rows = $stmt->affected_rows;
        $stmt->close();
        return $num_affected_rows > 0;
    }

    /**
     * Deleting a task
     * @param String $task_id id of the task to delete
     */
    public function deleteTask($user_id, $task_id) {
        $stmt = $this->conn->prepare("DELETE t FROM tasks t, user_tasks ut WHERE t.id = ? AND ut.task_id = t.id AND ut.user_id = ?");
        $stmt->bind_param("ii", $task_id, $user_id);
        $stmt->execute();
        $num_affected_rows = $stmt->affected_rows;
        $stmt->close();
        return $num_affected_rows > 0;
    }

    /* ------------- `user_tasks` table method ------------------ */

    /**
     * Function to assign a task to user
     * @param String $user_id id of the user
     * @param String $task_id id of the task
     */
    public function createUserTask($user_id, $task_id) {
        $stmt = $this->conn->prepare("INSERT INTO user_tasks(user_id, task_id) values(?, ?)");
        $stmt->bind_param("ii", $user_id, $task_id);
        $result = $stmt->execute();

        if (false === $result) {
            die('execute() failed: ' . htmlspecialchars($stmt->error));
        }
        $stmt->close();
        return $result;
    }

}

?>
