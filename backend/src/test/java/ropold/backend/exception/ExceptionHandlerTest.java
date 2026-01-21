package ropold.backend.exception;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import ropold.backend.service.RealEstateService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RealEstateService realEstateService;

    @Test
    void whenRealEstateNotFoundException_thenReturnsNotFound() throws Exception {
        mockMvc.perform(get("/api/immo-calc-hub/{id}", "non-existing-id"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No Real Estate found with id: non-existing-id"));
    }

    @Test
    void whenRuntimeException_thenReturnsInternalServerError() throws Exception {
        when(realEstateService.getRealEstateById(any())).thenThrow(new RuntimeException("Unexpected error"));

        mockMvc.perform(get("/api/immo-calc-hub/{id}", "any-id"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Unexpected error"));

    }

    @Test
    @WithMockUser(username = "user")
    void whenAccessDeniedException_thenReturnsForbidden() throws Exception {
        when(realEstateService.getRealEstateById(any())).thenThrow(new AccessDeniedException("Access denied"));

        mockMvc.perform(get("/api/immo-calc-hub/{id}", "any-id"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Access denied"));
    }

    @Test
    void testGetRealEstateById_shouldReturnNotFound() throws Exception {
        when(realEstateService.getRealEstateById("999")).thenReturn(null);

        mockMvc.perform(get("/api/immo-calc-hub/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No Real Estate found with id: 999"));
    }

}