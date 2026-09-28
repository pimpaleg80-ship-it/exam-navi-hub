#!/bin/bash
while ! nc -z localhost 5173; do
  sleep 1
done
python /home/jules/verification/verify.py
