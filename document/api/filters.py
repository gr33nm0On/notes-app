import django_filters
from document.models import Note


class NoteFilter(django_filters.FilterSet):
    from_date = django_filters.DateFilter(
        field_name="created_at",
        lookup_expr='date__gte'
    )
    to_date = django_filters.DateFilter(
        field_name="created_at",
        lookup_expr='date__lte'
    )

    class Meta:
        model = Note
        fields = []