# Generated by Django 4.1.4 on 2023-01-05 10:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='board',
            name='Name',
            field=models.CharField(default=0, max_length=20),
            preserve_default=False,
        ),
    ]
