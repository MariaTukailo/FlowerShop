package flowershop.components;

import lombok.extern.slf4j.Slf4j;
import flowershop.dto.CustomerDto;
import flowershop.entity.SearchKey;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class CustomerHashMap {

    private final Map<SearchKey, Page<CustomerDto>> hashMap = new HashMap<>();

    public void put(SearchKey key, Page<CustomerDto> page) {
        hashMap.put(key, page);
    }

    public Page<CustomerDto> get(SearchKey key) {
        return hashMap.get(key);
    }

    public boolean containsKey(SearchKey key) {
        return hashMap.containsKey(key);
    }

    public void clear() {
        hashMap.clear();
        log.info("Очистка кэша (инвалидация индекса)");
    }

}
