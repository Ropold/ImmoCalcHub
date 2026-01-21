package ropold.backend.exception;

public class RealEstateNotFoundException extends RuntimeException {
    public RealEstateNotFoundException(String message) {
        super(message);
    }
}
