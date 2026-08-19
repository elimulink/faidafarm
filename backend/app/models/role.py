from enum import StrEnum


class UserRole(StrEnum):
    FARMER = "farmer"
    FIELD_OFFICER = "field_officer"
    RESEARCHER = "researcher"
    SUPERVISOR = "supervisor"
    ANALYST = "analyst"
    ADMIN = "admin"
    VIEWER = "viewer"
