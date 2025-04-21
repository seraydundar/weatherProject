from rest_framework.viewsets import ReadOnlyModelViewSet
from .models import WeatherData
from .serializers import WeatherDataSerializer
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

class WeatherDataViewSet(ReadOnlyModelViewSet):
    queryset = WeatherData.objects.all().order_by('date_time')
    serializer_class = WeatherDataSerializer
    filter_backends = [SearchFilter, DjangoFilterBackend]
    filterset_fields = ['city']
    search_fields = ['city', 'weather_condition']
