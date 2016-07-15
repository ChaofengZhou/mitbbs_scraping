# coding:utf-8

from mitbbs import Mitbbs
from threading import Timer

base_url = 'http://www.mitbbs.com/bbsdoc1/JobHunting_'

inst = Mitbbs(base_url);

def short_term():
  print "Starting short-term updating"
  inst.two_pages()
  Timer(30, short_term).start()

def median_term():
  print "Starting avg-term updating"
  inst.thirty_pages()
  Timer(60 * 60 * 24 * 1, median_term).start()

def long_term():
  print "Starting long-term updating"
  inst.three_hundred_pages()
  Timer(60 * 60 * 24 * 10, long_term).start()

short_term()
long_term()
median_term()
