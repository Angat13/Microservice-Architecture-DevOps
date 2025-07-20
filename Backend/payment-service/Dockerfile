FROM python:3.10
WORKDIR /app
COPY . .
RUN pip install flask pymongo flask-cors PyJWT 
EXPOSE 5002
CMD ["python", "app.py"]