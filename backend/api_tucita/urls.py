from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import PacienteViewSet, ProfesionalViewSet, CitaViewSet, ArchivoViewSet, GraficoAtencionAPIView, ultimos_pacientes_atendidos,indicadores_pacientes
router = DefaultRouter()
router.register(r'pacientes', PacienteViewSet)
router.register(r'profesionales', ProfesionalViewSet)
router.register(r'citas', CitaViewSet)
router.register(r'archivos', ArchivoViewSet) 

urlpatterns = [
    path('', include('core.urls')),
    path('', include(router.urls)),
    path("grafico-atencion/", GraficoAtencionAPIView.as_view(), name="grafico-atencion"),
    path('api/ultimos-pacientes-atendidos/', ultimos_pacientes_atendidos, name='ultimos-pacientes'),
    path('api/indicadores-pacientes/', indicadores_pacientes, name='indicadores-pacientes'),
]