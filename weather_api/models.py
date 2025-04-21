from django.db import models

class WeatherData(models.Model):
    city = models.CharField(max_length=50)
    date_time = models.DateTimeField()
    temperature = models.FloatField()
    humidity = models.IntegerField()
    wind_speed = models.FloatField()
    weather_condition = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.city} | {self.date_time.strftime('%Y-%m-%d %H:%M')}"
