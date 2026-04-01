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
import org.junit.jupiter.api.DisplayName;
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

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private ShoppingCartRepository shoppingCartRepository;
    @Mock
    private CustomerHashMap hashMap;

    @InjectMocks
    private OrderService orderService;

    private Customer customer;
    private ShoppingCart cart;
    private Bouquet bouquet;
    private final String testAddress = "ул. Цветочная, 15";

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

    @Test
    @DisplayName("Поиск всех заказов")
    void findAll_Success() {
        when(orderRepository.findAll()).thenReturn(List.of(new Order()));
        List<OrderDto> result = orderService.findAll();
        assertFalse(result.isEmpty());
    }

    @Test
    @DisplayName("Поиск заказа по ID")
    void findById_Success() {
        Order order = new Order();
        order.setId(1L);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        OrderDto result = orderService.findById(1L);
        assertNotNull(result);
    }

    @Test
    @DisplayName("Заказ не найден по ID")
    void findById_NotFound() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> orderService.findById(1L));
    }

    @Test
    @DisplayName("Успешное создание заказа из корзины")
    void createFromCart_Success() {
        LocalDate date = LocalDate.now();
        LocalTime time = LocalTime.now();

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]);

        OrderDto result = orderService.createFromCart(1L, date, time, testAddress);

        assertNotNull(result);
        verify(shoppingCartRepository).save(any());
        verify(orderRepository).save(argThat(order -> order.getAddress().equals(testAddress)));
        verify(hashMap).clear();
    }

    @Test
    @DisplayName("Ошибка при пустой дате или времени")
    void createFromCart_NullDateTime() {
        LocalDate date = LocalDate.now();
        LocalTime time = LocalTime.now();

        assertThrows(IllegalArgumentException.class, () ->
                orderService.createFromCart(1L, null, time, testAddress)
        );

        assertThrows(IllegalArgumentException.class, () ->
                orderService.createFromCart(1L, date, null, testAddress)
        );
    }

    @Test
    @DisplayName("Покупатель не найден")
    void createFromCart_CustomerNotFound() {
        when(customerRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () ->
                orderService.createFromCart(1L, LocalDate.now(), LocalTime.now(), testAddress)
        );
    }

    @Test
    @DisplayName("Корзина пуста")
    void createFromCart_EmptyCart() {
        cart.getBouquets().clear();
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));

        assertThrows(IllegalStateException.class, () ->
                orderService.createFromCart(1L, LocalDate.now(), LocalTime.now(), testAddress)
        );
    }

    @Test
    @DisplayName("В корзине есть неактивные букеты")
    void createFromCart_InactiveBouquets() {
        bouquet.setActive(false);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));

        assertThrows(IllegalStateException.class, () ->
                orderService.createFromCart(1L, LocalDate.now(), LocalTime.now(), testAddress)
        );
    }

    @Test
    @DisplayName("Успешное обновление статуса")
    void updateStatus_Success() {
        Order order = new Order();
        order.setId(1L);
        order.setStatus(OrderStatus.PROCESSING);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]);

        OrderDto result = orderService.updateStatus(1L, "DELIVERED");

        assertNotNull(result);
        verify(orderRepository).save(argThat(o -> o.getStatus() == OrderStatus.DELIVERED));
        verify(hashMap).clear();
    }

    @Test
    @DisplayName("Некорректный статус")
    void updateStatus_InvalidStatus() {
        Order order = new Order();
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        assertThrows(IllegalArgumentException.class, () -> orderService.updateStatus(1L, "INVALID_STATUS_NAME"));
    }

    @Test
    @DisplayName("Расчет итоговой цены при нескольких букетах")
    void createFromCart_PriceCalculationWithMultipleBouquets() {
        Bouquet bouquet2 = new Bouquet();
        bouquet2.setPrice(150.0);
        bouquet2.setActive(true);
        cart.getBouquets().add(bouquet2);

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]);

        orderService.createFromCart(1L, LocalDate.now(), LocalTime.now(), testAddress);

        verify(orderRepository).save(argThat(savedOrder -> savedOrder.getFinalPrice() == 250.0));
    }

    @Test
    @DisplayName("Ошибка если список букетов в корзине null")
    void createFromCart_CartWithNullBouquetsList() {
        cart.setBouquets(null);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));

        assertThrows(IllegalStateException.class, () ->
                orderService.createFromCart(1L, LocalDate.now(), LocalTime.now(), testAddress)
        );
    }

    @Test
    @DisplayName("Обновление статуса (регистронезависимо)")
    void updateStatus_StatusCaseInsensitive() {
        Order order = new Order();
        order.setId(1L);
        order.setStatus(OrderStatus.PROCESSING);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]);


        orderService.updateStatus(1L, "cancelled");

        verify(orderRepository).save(argThat(o -> o.getStatus() == OrderStatus.CANCELLED));
    }

    @Test
    @DisplayName("Заказ не найден при обновлении статуса")
    void updateStatus_NotFound() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> orderService.updateStatus(1L, "COMPLETED"));
    }
}