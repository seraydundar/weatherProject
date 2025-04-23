from django.core.management.base import BaseCommand
import pandas as pd
from weather_api.models import WeatherData
from datetime import datetime

class Command(BaseCommand):
    help = "CSV'den hava durumu verilerini Django'ya aktarır"

    def handle(self, *args, **kwargs):
        df = pd.read_csv(r"C:\Users\Seray\weatherProject\hava_durumu.csv")

        WeatherData.objects.all().delete()  # Var olan verileri temizle

        data_list = []
        for _, row in df.iterrows():
            try:
                # Fazlalık :00 varsa keselim
                cleaned_date = str(row["date_time"]).strip()
                if cleaned_date.endswith(":00:00"):
                    cleaned_date = cleaned_date[:-3]  # son 3 karakteri sil
                elif cleaned_date.count(":") > 2:
                    cleaned_date = ":".join(cleaned_date.split(":")[:3])  # sadece HH:MM:SS al

                parsed_date = datetime.strptime(cleaned_date, "%Y-%m-%d %H:%M:%S")

                data_list.append(
                    WeatherData(
                        city=row["city"],
                        date_time=parsed_date,
                        temperature=row["temperature"],
                        humidity=row["humidity"],
                        wind_speed=row["wind_speed"],
                        weather_condition=row["weather_condition"]
                    )
                )
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Tarih parse edilemedi: {row['date_time']} → {e}"))
                continue

        WeatherData.objects.bulk_create(data_list)
        self.stdout.write(self.style.SUCCESS(f"{len(data_list)} kayıt başarıyla yüklendi."))
