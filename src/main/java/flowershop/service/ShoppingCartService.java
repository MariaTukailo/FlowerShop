package flowershop.service;

import flowershop.entity.Bouquet;
import flowershop.entity.Customer;
import flowershop.entity.ShoppingCart;
import flowershop.exception.TransactionDemoException;
import flowershop.repository.CustomerRepository;
import flowershop.repository.ShoppingCartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ShoppingCartService {

    private final ShoppingCartRepository shoppingCartRepository;
    private final CustomerRepository customerRepository; // Добавили репозиторий клиента
    private final BouquetService bouquetService;

    // Метод теперь ищет клиента, а потом берет его корзину
    public ShoppingCart getByCustomerId(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new TransactionDemoException("Клиент с id " + customerId + " не найден"));

        ShoppingCart cart = customer.getCart();
        if (cart == null) {
            throw new TransactionDemoException("Корзина для клиента не инициализирована");
        }
        return cart;
    }

    @Transactional
    public ShoppingCart addBouquet(Long customerId, Long bouquetId) {
        ShoppingCart cart = getByCustomerId(customerId);
        Bouquet bouquet = bouquetService.getById(bouquetId);

        cart.getBouquets().add(bouquet);




        return shoppingCartRepository.save(cart);
    }

    @Transactional
    public ShoppingCart removeBouquet(Long customerId, Long bouquetId) {
        ShoppingCart cart = getByCustomerId(customerId);
        Bouquet bouquet = bouquetService.getById(bouquetId);

        cart.getBouquets().remove(bouquet);



        return shoppingCartRepository.save(cart);
    }

    @Transactional
    public void clear(Long customerId) {
        ShoppingCart cart = getByCustomerId(customerId);

        cart.getBouquets().clear();


        shoppingCartRepository.save(cart);
    }
}