# Generated by Django 4.2.5 on 2025-07-04 19:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_tucita', '0004_profesional_profesional'),
    ]

    operations = [
        migrations.AddField(
            model_name='profesional',
            name='edad',
            field=models.IntegerField(blank=True, default=0, max_length=3, null=True),
        ),
        migrations.AddField(
            model_name='profesional',
            name='ganancias',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='profesional',
            name='precio',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10, null=True),
        ),
    ]
