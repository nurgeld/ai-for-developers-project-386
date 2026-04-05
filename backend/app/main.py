from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import settings, event_types, slots, bookings, owner_settings

app = FastAPI(title="Calendar Booking API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(settings.router)
app.include_router(event_types.router)
app.include_router(event_types.router_owner)
app.include_router(slots.router)
app.include_router(bookings.router)
app.include_router(bookings.router_owner)
app.include_router(owner_settings.router)
