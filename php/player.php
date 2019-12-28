<?php
  $request = $_POST['request'];
  if ($request == 'order') {
    $file_handler = @fopen('player.txt', 'rb') or die('ファイルを開けませんでした。');
    rewind($file_handler);
    $order = fgets($file_handler);
    fclose($file_handler);
    $file_handler = @fopen('player.txt', 'r+b') or die('ファイルを開けませんでした。');
    if ($order == '0') {
      rewind($file_handler);
      fwrite($file_handler, '1');
      print 1;
    } else if ($order == '1') {
      rewind($file_handler);
      fwrite($file_handler, '0');
      print 2;
    }
    fclose($file_handler);
  }
  if ($request == 'send') {
    $stone_array = $_POST['stone_array'];
    $check_array = $_POST['check_array'];
    $stones = $_POST['stones'];
    $pass_stone = $_POST['pass_stone'];
    $file_handler = @fopen('array.txt', 'w+b') or die('ファイルを開けませんでした。');
    rewind($file_handler);
    fwrite($file_handler, $stone_array . '/' . $check_array . '/' . $stones . '/' . $pass_stone);
    fclose($file_handler);
  }
  if ($request == 'read') {
    $file_handler = @fopen('array.txt', 'r+b') or die('ファイルを開けませんでした。');
    rewind($file_handler);
    $read_array = fgets($file_handler);
    fclose($file_handler);
    print $read_array;
  }
?>