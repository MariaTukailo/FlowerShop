package flowershop.service;

import flowershop.entity.Order;
import flowershop.entity.ShoppingCart;
import flowershop.exception.TransactionDemoException;
import flowershop.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import flowershop.entity.Customer;
import flowershop.repository.CustomerRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ShoppingCartService shoppingCartService;
    private final CustomerRepository customerRepository;

    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new TransactionDemoException("Заказ№" + id + " не найден"));
    }

    @Transactional
    public Order createOrder(Long customerId) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new TransactionDemoException("Клиент не найден"));

        ShoppingCart cart = customer.getCart();
        if (cart == null || cart.getBouquets().isEmpty()) {
            throw new TransactionDemoException("Корзина пуста!");
        }


        Order order = new Order();
        order.setDate(LocalDateTime.now());
        order.setStatus("ПРИНЯТ");



        List<String> receipt = cart.getBouquets().stream()
                .map(b -> b.getName() + "+" )
                .toList();
        order.setItems(new ArrayList<>(receipt));

        Order savedOrder = orderRepository.save(order);

        customer.getOrders().add(savedOrder);
        customerRepository.save(customer);
        shoppingCartService.clear(customerId);

        return savedOrder;
    }

    @Transactional
    public Order updateStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new TransactionDemoException("Заказ №" + orderId + " не найден"));

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    // 3. Удаление заказа
    @Transactional
    public void deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new TransactionDemoException("Заказ №" + orderId + " не найдено"));

        orderRepository.delete(order);
    }

    public List<Order> getAll() {
        return orderRepository.findAll();
    }
}