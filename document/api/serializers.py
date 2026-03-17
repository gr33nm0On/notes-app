from rest_framework import serializers
from django.contrib.auth.models import User

from document.models import Note, NoteFile, Category
from django.core.validators import MinLengthValidator
import os

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')

class NoteFileSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    class Meta:
        model = NoteFile
        fields = ['id', 'file', 'name', 'url', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']

    def get_name(self, obj):
        """Возвращает имя файла без пути"""
        return os.path.basename(obj.file.name)

    def get_url(self, obj):
        """Возвращает абсолютный URL файла"""
        return obj.file.url


class NoteSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        max_length=100,
        validators=[MinLengthValidator(3)],
        error_messages={
            'min_length': 'Название должно содержать минимум 3 символа'
        }
    )
    description = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        required=False,
        allow_null=True
    )

    files_upload = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False,
        help_text="Список файлов для загрузки"
    )

    files = NoteFileSerializer(many=True, read_only=True)

    class Meta:
        model = Note
        fields = [
            'id',
            'name',
            'description',
            'category',
            'files',
            'files_upload',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        files_to_upload = validated_data.pop('files_upload', [])

        note = Note.objects.create(**validated_data)

        for file in files_to_upload:
            NoteFile.objects.create(note=note, file=file)

        return note

    def update(self, instance, validated_data):
        files_to_upload = validated_data.pop('files_upload', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        for file in files_to_upload:
            NoteFile.objects.create(note=instance, file=file)

        return instance
