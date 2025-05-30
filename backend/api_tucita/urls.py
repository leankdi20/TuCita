from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import PacienteViewSet, ProfesionalViewSet, CitaViewSet, DiagnosticoViewSet

router = DefaultRouter()
router.register(r'pacientes', PacienteViewSet)
router.register(r'profesionales', ProfesionalViewSet)
router.register(r'citas', CitaViewSet)
router.register(r'diagnosticos', DiagnosticoViewSet)

urlpatterns = [
    path('', include('core.urls')),
    path('', include(router.urls)),
]