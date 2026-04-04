from fastapi import FastAPI
from app.routers import event_types, slots, bookings, availability

app = FastAPI(
    title="Booking API",
    description="API для системы бронирования по TypeSpec контракту",
    version="0.1.0",
)

app.include_router(event_types.router)
app.include_router(slots.router)
app.include_router(bookings.router)
app.include_router(availability.router)


@app.get("/")
def root():
    return {"message": "Booking API", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
