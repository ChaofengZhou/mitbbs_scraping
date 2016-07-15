# coding:utf-8

from bs4 import BeautifulSoup
from pymongo import MongoClient
from datetime import datetime
from threading import Thread
import re
import requests

class Mitbbs:
  def __init__(self, indexUrl):
    self.baseUrl = indexUrl

  def connectDB(self):
    client = MongoClient('mongodb://localhost:27017/')
    self.db = client.mitbbs
    self.posts = self.db.posts

  def updateDB(self, posts):
    for post in posts:
      self.posts.update({'_id': post['_id']}, {'$set': post}, True)

  def two_pages(self):
    self.run(201)

  def thirty_pages(self):
    self.run(3001)

  def three_hundred_pages(self):
    self.run(30001)

  def run(self, max):
    self.connectDB();
    index = 1;
    while (index < max):
      i = 0;
      page_urls = []
      while (i < 4 and index < max):
        page = {}
        page['url'] = self.baseUrl + str(index) + '_0.html'
        page['index'] = index;
        page_urls.append(page)
        index += 100;
        i += 1;
      threads = [Thread(target=self.page, args=(page['url'], page['index'])) for page in page_urls]
      [x.start() for x in threads]
      [x.join() for x in threads]
      print 'Finished a group'

  def page(self, url, index):
    soup = self.build_soup(url)
    tbody = soup.find('tr', attrs={'class': 'top-bg'}).parent
    rows = tbody.find_all('tr')[1:]
    for row in rows:
      tds = row.find_all('td')
      if tds[0].find('img'):
        continue
      post = {}
      title_link = tds[2].find('a')
      reply_view = tds[3].get_text().split('/')
      author_date = tds[4]
      post['_id'] = int(re.findall(r'\d+', title_link['href'])[0])
      post['title'] = title_link.get_text().strip(' \t\n\r')[2:]
      post['link'] = title_link['href']
      post['author'] = author_date.find('a').get_text()
      post['createDate'] = datetime.strptime(author_date.find('span').get_text(), "%Y-%m-%d")
      post['updateDate'] = datetime.strptime(author_date.find('span').get_text(), "%Y-%m-%d")
      post['views'] = int(reply_view[1])
      post['replies'] = int(reply_view[0])
      self.posts.update({'_id': post['_id']}, {'$set': post}, True)
    print "Finished page", index / 100 + 1

  def build_soup(self, url):
    result = requests.get(url)
    content = result.content.decode('gbk', 'ignore').encode('utf-8')
    return BeautifulSoup(content, 'html.parser')

