package flowershop.service;

import flowershop.components.CustomerHashMap;
import flowershop.dto.OrderDto;
import flowershop.entity.Bouquet;
import flowershop.entity.Customer;
import flowershop.entity.Order;
import flowershop.entity.ShoppingCart;
import flowershop.enums.OrderStatus;
import flowershop.repository.CustomerRepository;
import flowershop.repository.OrderRepository;
import flowershop.repository.ShoppingCartRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private CustomerRepository customerRepository;
    @Mock private ShoppingCartRepository shoppingCartRepository;
    @Mock private CustomerHashMap hashMap;

    @InjectMocks
    private OrderService orderService;

    private Customer customer;
    private ShoppingCart cart;
    private Bouquet bouquet;
    private final String testAddress = "ул. Цветочная, 15";
    private final LocalDate testDate = LocalDate.now();
    private final LocalTime testTime = LocalTime.now();

    @BeforeEach
    void setUp() {
        bouquet = new Bouquet();
        bouquet.setId(1L);
        bouquet.setPrice(100.0);
        bouquet.setActive(true);

        cart = new ShoppingCart();
        cart.setId(1L);
        cart.setBouquets(new ArrayList<>(List.of(bouquet)));

        customer = new Customer();
        customer.setId(1L);
        customer.setCart(cart);
    }

    private void mockCustomerFound() {
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
    }

    @Test
    void findAll_Success() {
        when(orderRepository.findAll()).thenReturn(List.of(new Order()));
        assertFalse(orderService.findAll().isEmpty());
    }

    @Test
    void findById_Success() {
        Order order = new Order();
        order.setId(1L);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        assertNotNull(orderService.findById(1L));
    }

    @Test
    void findById_NotFound() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> orderService.findById(1L));
    }

    @Test
    void createFromCart_Success() {
        mockCustomerFound();
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]);

        OrderDto result = orderService.createFromCart(1L, testDate, testTime, testAddress);

        assertNotNull(result);
        verify(shoppingCartRepository).save(any());
        verify(orderRepository).save(argThat(order -> testAddress.equals(order.getAddress())));
        verify(hashMap).clear();
    }

    @Test
    void createFromCart_NullDateTime() {
        assertThrows(IllegalArgumentException.class, () ->
                orderService.createFromCart(1L, null, testTime, testAddress));
        assertThrows(IllegalArgumentException.class, () ->
                orderService.createFromCart(1L, testDate, null, testAddress));
    }

    @Test
    void createFromCart_CustomerNotFound() {
        when(customerRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () ->
                orderService.createFromCart(1L, testDate, testTime, testAddress));
    }

    @Test
    void createFromCart_CartValidations() {
        mockCustomerFound();

        cart.getBouquets().clear();
        assertThrows(IllegalStateException.class, () ->
                orderService.createFromCart(1L, testDate, testTime, testAddress));

        cart.getBouquets().add(bouquet);
        bouquet.setActive(false);
        assertThrows(IllegalStateException.class, () ->
                orderService.createFromCart(1L, testDate, testTime, testAddress));

        cart.setBouquets(null);
        assertThrows(IllegalStateException.class, () ->
                orderService.createFromCart(1L, testDate, testTime, testAddress));
    }

    @Test
    void updateStatus_Success() {
        Order order = new Order();
        order.setStatus(OrderStatus.PROCESSING);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]);

        orderService.updateStatus(1L, "DELIVERED");

        verify(orderRepository).save(argThat(o -> o.getStatus() == OrderStatus.DELIVERED));
        verify(hashMap).clear();
    }

    @Test
    void updateStatus_InvalidStatus() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(new Order()));
        assertThrows(IllegalArgumentException.class, () -> orderService.updateStatus(1L, "INVALID"));
    }

    @Test
    void complexBusinessLogicTest() {
        mockCustomerFound();
        Bouquet b2 = new Bouquet(); b2.setPrice(150.0); b2.setActive(true);
        cart.getBouquets().add(b2);
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]);

        orderService.createFromCart(1L, testDate, testTime, testAddress);
        verify(orderRepository).save(argThat(o -> o.getFinalPrice() == 250.0));

        Order order = new Order();
        when(orderRepository.findById(2L)).thenReturn(Optional.of(order));
        orderService.updateStatus(2L, "cancelled");
        verify(orderRepository).save(argThat(o -> o.getStatus() == OrderStatus.CANCELLED));
    }

    @Test
    void updateStatus_NotFound() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> orderService.updateStatus(1L, "COMPLETED"));
    }
}