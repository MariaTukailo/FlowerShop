package flowershop.controller;

import flowershop.entity.ShoppingCart;
import flowershop.service.ShoppingCartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/shopping-carts")
@RequiredArgsConstructor
public class ShoppingCartController {

    private final ShoppingCartService shoppingCartService;

    @GetMapping("/{customerId}")
    public ShoppingCart getCart(@PathVariable Long customerId) {
        return shoppingCartService.getByCustomerId(customerId);
    }

    @PostMapping("/{customerId}/add/{bouquetId}")
    public ShoppingCart addBouquet(@PathVariable Long customerId, @PathVariable Long bouquetId) {
        return shoppingCartService.addBouquet(customerId, bouquetId);
    }

    @DeleteMapping("/{customerId}/remove/{bouquetId}")
    public ShoppingCart removeBouquet(@PathVariable Long customerId, @PathVariable Long bouquetId) {
        return shoppingCartService.removeBouquet(customerId, bouquetId);
    }


    @DeleteMapping("/{customerId}/clear")
    public void clearCart(@PathVariable Long customerId) {
        shoppingCartService.clear(customerId);
    }
}