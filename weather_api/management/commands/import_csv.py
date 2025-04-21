from django.core.management.base import BaseCommand
import pandas as pd
from weather_api.models import WeatherData
from datetime import datetime

class Command(BaseCommand):
    help = "CSV'den hava durumu verilerini Django'ya aktarır"

    def handle(self, *args, **kwargs):
        df = pd.read_csv(r"C:\Users\Oğuzhan\Desktop\hava_durumu.csv")

        WeatherData.objects.all().delete()  # Var olan verileri temizle

        data_list = []
        for _, row in df.iterrows():
            data_list.append(
                WeatherData(
                    city=row["city"],
                    date_time=datetime.strptime(row["date_time"], "%Y-%m-%d %H:%M:%S"),
                    temperature=row["temperature"],
                    humidity=row["humidity"],
                    wind_speed=row["wind_speed"],
                    weather_condition=row["weather_condition"]
                )
            )

        WeatherData.objects.bulk_create(data_list)
        self.stdout.write(self.style.SUCCESS("CSV verileri başarıyla aktarıldı!"))
