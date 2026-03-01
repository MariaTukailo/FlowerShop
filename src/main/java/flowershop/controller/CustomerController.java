package flowershop.controller;

import flowershop.entity.Customer;
import flowershop.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/simple")
    public List<Customer> getAllSimple() {
        return customerService.getAll();
    }

    @GetMapping("/with-orders")
    public List<Customer> getAllWithOrders() {
        return customerService.getAll();
    }

    @PostMapping
    public Customer create(@RequestBody Customer customer) {
        return customerService.save(customer);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return "Пользователь с id " + id + " и его корзина успешно удалены";
    }

    @GetMapping("/{id}")
    public Customer getById(@PathVariable Long id) {
        return customerService.findById(id);
    }

    @PutMapping("/{id}")
    public Customer update(@PathVariable Long id, @RequestBody Customer customerDetails) {
        return customerService.update(id, customerDetails);
    }

    @PostMapping("/test-transaction")
    public String testTransaction(
            @RequestParam String name,
            @RequestParam String phone,
            @RequestParam boolean error) {
        customerService.createCustomerWithCart(name, phone, error);
        return "Операция успешно завершена";
    }


    @PostMapping("/test/with-transaction")
    public String testWith(@RequestParam String name, @RequestParam String phone, @RequestParam boolean error) {
        customerService.createWithTransaction(name, phone, error);
        return "Успешно (с транзакцией)";
    }

    @PostMapping("/test/no-transaction")
    public String testWithout(@RequestParam String name, @RequestParam String phone, @RequestParam boolean error) {
        customerService.createWithoutTransaction(name, phone, error);
        return "Успешно (без транзакции)";
    }
}