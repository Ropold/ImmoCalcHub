package ropold.backend.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RealEstateNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public RealEstateError handleRealEstateNotFoundException(RealEstateNotFoundException e) {
        log.error("RealEstateNotFoundException: {}", e.getMessage(), e);
        return new RealEstateError(e.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public RealEstateError handleRuntimeException(RuntimeException e) {
        log.error("Unhandled RuntimeException: {}", e.getMessage(), e);
        return new RealEstateError(e.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public AccessDeniedError handleAccessDeniedException(AccessDeniedException e) {
        return new AccessDeniedError(e.getMessage());
    }
}
