from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import event_types, slots, bookings, availability

app = FastAPI(title="Booking API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(event_types.router)
app.include_router(slots.router)
app.include_router(bookings.router)
app.include_router(availability.router)
