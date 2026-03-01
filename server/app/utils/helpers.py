"""
Shared utility helpers used across the application.
"""
from bson import ObjectId
from datetime import datetime


def serialize_doc(doc: dict) -> dict:
    """
    Recursively convert a MongoDB document to a JSON-serializable dict.
    - ObjectId  → str
    - datetime  → ISO-8601 str (kept as datetime for Pydantic to serialise later)
    """
    if doc is None:
        return {}
    out = {}
    for key, value in doc.items():
        if key == "_id":
            out["id"] = str(value)
        elif isinstance(value, ObjectId):
            out[key] = str(value)
        elif isinstance(value, list):
            out[key] = [serialize_doc(item) if isinstance(item, dict) else item for item in value]
        elif isinstance(value, dict):
            out[key] = serialize_doc(value)
        else:
            out[key] = value
    return out
