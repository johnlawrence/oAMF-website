<?php
header('Content-type: application/json');

if(isset($_GET['apiKey'])){

    $entityBody = file_get_contents('php://input');
    $url = $_GET['url'];

    $ch = curl_init();

    //set the url, number of POST vars, POST data
    curl_setopt($ch,CURLOPT_URL, $url);
    curl_setopt($ch,CURLOPT_POST, 1);
    curl_setopt($ch,CURLOPT_POSTFIELDS, $entityBody);    
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'X-N8N-API-KEY: '. $_GET['apiKey']
    ]);

    //execute post
    $result = curl_exec($ch);

    //close connection
    curl_close($ch);
}elseif(isset($_GET['svg'])){

    $entityBody = file_get_contents('php://input');
    $url = $_GET['url'];

    $ch = curl_init();

    //set the url, number of POST vars, POST data
    curl_setopt($ch,CURLOPT_URL, $url);
    curl_setopt($ch,CURLOPT_POST, 1);
    curl_setopt($ch,CURLOPT_POSTFIELDS, $entityBody);    
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);

    //execute post
    $result = curl_exec($ch);

    //close connection
    curl_close($ch);
}else{
    echo "{'Error':'No method'}";
}
?>