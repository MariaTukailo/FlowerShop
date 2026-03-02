package flowershop.service;

import flowershop.entity.Customer;
import flowershop.entity.ShoppingCart;
import flowershop.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import flowershop.exception.TransactionDemoException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Transactional
    public void createCustomerWithCart(String name, String phone, boolean triggerError) {
        Customer customer = new Customer();
        customer.setName(name);
        customer.setPhoneNumber(phone);

        ShoppingCart cart = new ShoppingCart();

        customer.setCart(cart);

        customerRepository.save(customer);

        if (triggerError) {
            throw new TransactionDemoException("Специальный сбой для отката транзакции!");
        }
    }

    public List<Customer> getAll() {
        return customerRepository.findAll();
    }

    public Customer findById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public Customer save(Customer customer) {
        return customerRepository.save(customer);
    }

    @Transactional
    public Customer update(Long id, Customer details) {
        Customer customer = findById(id);
        customer.setName(details.getName());
        customer.setPhoneNumber(details.getPhoneNumber());
        return customerRepository.save(customer);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        customer.setCart(null);
        customerRepository.saveAndFlush(customer);

        customerRepository.delete(customer);
    }

    @Transactional
    public void createWithTransaction(String name, String phone, boolean error) {
        saveLogic(name, phone, error);
    }


    public void createWithoutTransaction(String name, String phone, boolean error) {
        saveLogic(name, phone, error);
    }

    private void saveLogic(String name, String phone, boolean error) {
        Customer customer = new Customer();
        customer.setName(name);
        customer.setPhoneNumber(phone);

        ShoppingCart cart = new ShoppingCart();
        customer.setCart(cart);

        customerRepository.save(customer); // Сохраняем в базу

        if (error) {
            throw new TransactionDemoException("Ошибка после сохранения.");
        }
    }
}
