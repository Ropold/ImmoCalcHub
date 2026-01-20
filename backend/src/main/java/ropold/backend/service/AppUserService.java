package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.model.UserModel;
import ropold.backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final UserRepository appUserRepository;

    public UserModel getUserById(String userId) {
        return appUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
