from django_filters import rest_framework as filters
from .models import Cita, ESTADO_CHOICES

class CitaFilter(filters.FilterSet):
    estado = filters.MultipleChoiceFilter(choices=ESTADO_CHOICES)
    fecha__date = filters.DateFilter(field_name='fecha', lookup_expr='date')

    class Meta:
        model = Cita
        fields = ['estado', 'profesional','fecha']