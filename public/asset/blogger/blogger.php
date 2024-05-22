<?php

class Blogger{
  var $datas   = [];
  var $options = [];

  function __construct($options){
    $this->options = $options;
    $queries = $this->url2queries($options["feed"]);
    $queries["alt"] = isset($queries["alt"]) ? $queries["alt"] : "";
    switch($queries["alt"]){
      case "json":
        $this->datas   = $this->get_json($options["feed"]);
      break;

      case "rss":
        $this->datas   = $this->get_rss($options["feed"]);
      break;
    }
  }

  function url2queries($url=null){
    $query = parse_url($url, PHP_URL_QUERY);
    $queries = [];
    if($query){
      $sp1 = explode("&", $query);
      for($i=0; $i<count($sp1); $i++){
        $sp2 = explode("=", $sp1[$i]);
        $queries[$sp2[0]] = $sp2[1];
      }
    }
    return $queries;
  }

  function get_json($feed_url=null){
    $json = file_get_contents($feed_url);
    return json_decode($json, true);
  }

  function get_rss($feed_url=null){
    $result = array();
    // "@" is for error handling
    $feed = @simplexml_load_file($feed_url);
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
}