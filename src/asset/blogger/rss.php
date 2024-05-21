<?php

// mynt-blogのrssを読み込み
$rss_url = 'https://blog.myntinc.com/feeds/posts/default?alt=rss';

switch(@$_POST['mode']){
  case 'rss_parse':
    $data = GoogleBloggerRssParse($rss_url);
    echo json_encode($data);
    break;

  default:
    $rss = file_get_contents($rss_url);
    print_r($rss);
    break;
}


// ----------
// RSS parser
// get : https://blog.longkey1.net/2012/04/05/parse-rss-in-php/
function GoogleBloggerRssParse($feedUrl) {
  $result = array();
  // "@" is for error handling
  $feed = @simplexml_load_file($feedUrl);
  $ns = $feed->getNamespaces(true);

  //atom
  if (isset($feed->entry)) {
    $result['rss_ver'] = 'atom';
    $result['title']   = (string)$feed->title;
    $result['link']    = (string)$feed->link->attributes()->href;
    foreach ($feed->entry as $e){
      if(!empty($e->issued)) {
        $date = date('Y-m-d H:i:s', strtotime($e->issued));
      } else if ($e->updated) {
        $date = date('Y-m-d H:i:s', strtotime($e->updated));
      }
      $result['items'][] = array(
        'title'    => (string)$e->title, 
        'link'     => (string)$e->link['href'], 
        'date'     => $date, 
        'category' => (string)$e->category, 
        'media'    => (string)$e->media['src'],
      );
    }
  }
  //rss1.0
  elseif (isset($feed->item)) {
    $result['rss_ver'] = 'rss1.0';
    $result['title']   = (string)$feed->title;
    $result['link']    = (string)$feed->link;
    foreach ($feed->item as $i){
      $dc       = $i->children('http://purl.org/dc/elements/1.1/');
      $result['items'][] = array(
        'title'    => (string)$i->title, 
        'link'     => (string)$i->link, 
        'date'     => date('Y-m-d H:i:s', strtotime($dc->date)), 
        'category' => (string)$i->category,
        'media'    => (string)$i->media,
      );
    }
  }
  //rss2.0
  elseif (isset($feed->channel->item)) {
    $result['rss_ver'] = 'rss2.0';
    $result['title']   = (string)$feed->channel->title;
    $result['link']    = (string)$feed->channel->link;
    foreach ($feed->channel->item as $i){
      $d = strtotime($i->pubDate);
      $ymd = date('Y/m/d', $d);
      $his = date('H:i:s', $d);
      $result['items'][] = array(
        'title'    => (string)$i->title,
        'link'     => (string)$i->link,
        'date'     => `$ymd $his`,
        'ymd'      => $ymd,
        'hid'      => $his,
        'category' => (string)$i->category,
        'media'    => (string)$i->children($ns['media'])->thumbnail->attributes()->url,
      );
    }
  }
  else {
    return false;
  }
  return $result;
}